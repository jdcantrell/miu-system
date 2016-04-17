import Rx from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver, button, div, ul, li } from '@cycle/dom';

import { rule1, rule2, rule3, rule3Applies, rule4, rule4Applies } from './rules.js';

var initialState = {
  theorem: 'MI',
  select: null,
  index: null
};

function selectString(rule) {
  if (rule === rule3) return 'III';
  if (rule === rule4) return 'UU';
  return null;
}

function main({ DOM }) {
  const action$ = Rx.Observable.merge(
    DOM.select('.rule1').events('click').map(() => rule1),
    DOM.select('.rule2').events('click').map(() => rule2),
    DOM.select('.rule3').events('click').map(() => rule3),
    DOM.select('.rule4').events('click').map(() => rule4)
  );

  const $state = action$.startWith(initialState).scan((oldState, rule) => ({
    theorem: rule(oldState.theorem) || oldState.theorem,
    select: selectString(rule),
    index: null
  }));

  return {
    DOM: $state.map(({ theorem }) => div([
      // if select !== null
      // then find strings equal or greater than the current select
      // insert spans and highlight

      div('.current-theorem', theorem),
      ul([
        li([button('.rule1', 'Rule1'), 'MxI => MxU']),
        li([button('.rule2', 'Rule2'), 'Mx => Mxx']),
        li([button('.rule3', { disabled: !rule3Applies(theorem) }, 'Rule3'), 'MxIIIy => MxUy']),
        li([button('.rule4', { disabled: !rule4Applies(theorem) }, 'Rule4'), 'MxUUy => Mxy'])
      ])
    ]))
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app')
});

