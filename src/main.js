import Rx from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver, button, div, span, p, i, ol, li } from '@cycle/dom';

import { rule1, rule2, rule3, rule3Applies, rule4, rule4Applies } from './rules.js';

var initialState = {
  theorem: 'MI',
  select: null,
  history: []
};

function intents({ DOM }) {
  return {
    applyRule$: Rx.Observable.merge(
      DOM.select('button.rule1').events('click').map(() => rule1),
      DOM.select('button.rule2').events('click').map(() => rule2),
      DOM.select('.rule3 .I+.I+.I').events('click').map((ev) => rule3(ev.target.index - 2)),
      DOM.select('.rule4 .U+.U').events('click').map((ev) => rule4(ev.target.index - 1))
    ),
    historyClick$: DOM.select('.previous li:not(:first-child)').events('click').map((ev) => ev.target.index),
    selectIndex$: Rx.Observable.merge(
      DOM.select('button.rule3').events('click').map(() => '.rule3'),
      DOM.select('button.rule4').events('click').map(() => '.rule4'),
      DOM.select('body').events('keyup').filter((ev) => ev.which === 27).map(() => null)
    )
  };
}

function model({ applyRule$, selectIndex$, historyClick$ }) {
  var rule$ = applyRule$.map(rule => state => {
    var theorem = rule(state.theorem);

    if (theorem === null) {
      return state;
    }

    state.history.unshift(state.theorem);
    return {
      select: state.select,
      theorem: rule(state.theorem),
      history: state.history
    };
  });

  var select$ = selectIndex$.map(selectClass => state => ({
    theorem: state.theorem,
    history: state.history,
    select: selectClass
  }));

  var history$ = historyClick$.map(index => state => {
    var theorem = state.history[index];
    state.history.splice(0, index + 1);
    return {
      select: state.select,
      theorem: theorem,
      history: state.history
    };
  });

  return Rx.Observable.merge(rule$, select$, history$)
    .scan((state, operation) => operation(state), initialState);
}

function view(state$) {
  return state$.startWith(initialState).map(({ theorem, select, history }) => div([
    p(['The MU-puzzle is a puzzle described in ',
        i('Gödel, Escher, Bach: an Eternal Golden Braid'),
        ' by Douglas R. Hofstadter (33-41). You are given a starting axiom "MI" and four rules that you can use to manipulate the string. Your goal is to end up with "MU".'
    ]),
    div(`.theorem ${select}`, Array.prototype.map.call(theorem, (x, idx) => span(`.${x}`, { index: idx }, x))),
    div('.rules', [
      div([
        button('.rule1', 'Rule1'),
        'xI => xU — If you possess a string whose last letter is I, you can add on a U at the end.'
      ]),
      div([button('.rule2', 'Rule2'), 'Mx => Mxx — Suppose you have Mx. Then you may add Mxx to your collection. ']),
      div([button('.rule3', { disabled: !rule3Applies(theorem) }, 'Rule3'), 'MxIIIy => MxUy — If III occurs in one of the strings in your collection, you may make a new string with U in place of III.']),
      div([button('.rule4', { disabled: !rule4Applies(theorem) }, 'Rule4'), 'MxUUy => Mxy — If UU occurs inside one of your strings, you can drop it.'])
    ]),
    div('.previous', [
      'Previous Strings:',
      ol({ reversed: true }, [history.map((str, idx) => li({ index: idx }, str))])
    ])
  ]));
}


function main({ DOM }) {

  return {
    DOM: view(model(intents({ DOM })))
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('body')
});

