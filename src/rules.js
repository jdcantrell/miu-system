export function rule1(theorem) {
  if (theorem[theorem.length - 1] === 'I') {
    return `${theorem}U`;
  }
  return null;
}

export function rule2(theorem) {
  var x = theorem.substr(1, theorem.length);
  return `${theorem}${x}`;
}

export function rule3(theorem, index) {
  if (theorem.substr(index, 3) === 'III') {
    var x = theorem.substr(0, index);
    var y = theorem.substr(index + 3);
    return `${x}U${y}`;
  }
  return null;
}

export function rule3Applies(theorem) {
  return theorem.match(/III/) !== null;
}


export function rule4(theorem, index) {
  if (theorem.substr(index, 2) === 'UU') {
    var x = theorem.substr(0, index);
    var y = theorem.substr(index + 2);
    return `${x}${y}`;
  }
  return null;
}

export function rule4Applies(theorem) {
  return theorem.match(/UU/) !== null;
}
