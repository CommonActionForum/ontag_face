// Convert an array of strings into an array of {prefix, exact, suffix}
// if possible.
export function fragmentArray (array, {prefix, exact, suffix}) {
  if (array.join('') !== prefix + exact + suffix) {
    throw new Error('The array is not valid')
  }

  let acc = {prefix, exact, suffix}
  let arr = []
  for (let string of array) {
    const [match, rest] = fragmentString(string, acc)

    arr.push(match)
    acc = rest
  }

  return arr
}

// Divide the string into two fragments
// The first, matches with the parameter
// The second is the "other" part of the string
export function fragmentString (string, fragment) {
  const {prefix, exact, suffix} = fragment
  // Cut in the prefix?
  if (prefix.startsWith(string)) {
    const cut = {
      prefix: prefix.slice(0, string.length),
      exact: '',
      suffix: ''
    }

    const after = {
      prefix: prefix.slice(string.length),
      exact,
      suffix
    }

    return [cut, after]
  } else if ((prefix + exact).startsWith(string)) {
    const cut = {
      prefix,
      exact: exact.substr(0, string.length - prefix.length),
      suffix: ''
    }

    const after = {
      prefix: '',
      exact: exact.substr(string.length - prefix.length),
      suffix
    }

    return [cut, after]
  } else if ((prefix + exact + suffix).startsWith(string)) {
    const cut = {
      prefix: prefix,
      exact: exact,
      suffix: suffix.substr(0, string.length - prefix.length - exact.length)
    }

    const after = {
      prefix: '',
      exact: '',
      suffix: suffix.substr(string.length - prefix.length - exact.length)
    }

    return [cut, after]
  } else {
    throw new Error()
  }
}
