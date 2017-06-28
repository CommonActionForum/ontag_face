/**
 * Given a fragment object { prefix, exact, suffix } and an "e"
 * which can be a string or an array, return:
 * - One single fragment object (if the "e" is a string)
 * - An array of fragments (if the "e" is an array)
 *
 * representing all the fragments in which "fragment" is splitted
 */
export default function split (fragment, e) {
  const a = splitFragment(fragment, e)
  if (a.length === 2) {
    const [ret, n] = a

    if (n.prefix === '' && n.exact === '' && n.suffix === '') {
      return ret
    } else {
      return null
    }
  } else {
    return null
  }
}

//
function splitFragment (fragment, e) {
  if (typeof e === 'string') {
    return splitFragmentString(fragment, e)
  } else {
    return splitFragmentArray(fragment, e)
  }
}

function splitFragmentArray (fragment, array) {
  let r = []

  let current = fragment
  let next = {}

  for (let i = 0; i < array.length; i++) {
    let a = splitFragment(current, array[i])

    if (a.length === 2) {
      [next, current] = a
      r.push(next)
    } else {
      r = []
      break
    }
  }

  return [r, current]
}

// Fragment is a { prefix, suffix, exact }
// Text is a string
// Let's guess where is the "cut"
function splitFragmentString ({ prefix, exact, suffix }, text) {
  // Cut in the prefix?
  if (prefix.startsWith(text)) {
    const cut = {
      prefix: prefix.slice(0, text.length),
      exact: '',
      suffix: ''
    }

    const after = {
      prefix: prefix.slice(text.length),
      exact,
      suffix
    }

    return [cut, after]
  }

  // Cut in the exact?
  if ((prefix + exact).startsWith(text)) {
    const cut = {
      prefix,
      exact: exact.substr(0, text.length - prefix.length),
      suffix: ''
    }

    const after = {
      prefix: '',
      exact: exact.substr(text.length - prefix.length),
      suffix
    }

    return [cut, after]
  }

  // Cut in the suffix?
  if ((prefix + exact + suffix).startsWith(text)) {
    const cut = {
      prefix: prefix,
      exact: exact,
      suffix: suffix.substr(0, text.length - prefix.length - exact.length)
    }

    const after = {
      prefix: '',
      exact: '',
      suffix: suffix.substr(text.length - prefix.length - exact.length)
    }

    return [cut, after]
  }

  return []
}
