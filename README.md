# d3-sankey-data-faker
A data faker for Sankey d3 visualizations. The format it produces is based on the classic Sankey diagram example by Mike Bostock on energy data: https://bost.ocks.org/mike/sankey/

Input: a list of names by level

```

[
  ['First', 'Level', 'Names'],
  ['Second', 'Level', 'Names'],
  ['Third', 'Level', 'Names']
]

```

Output: a list of flat links

```

[
  {
    source: 0,
    target: 4,
    value: 100
  },
  {
    source: 1,
    target: 5,
    value: 50
  }
]

```

TODOS:

* Items don't currently skip levels.
* Items can terminate before the last level -- I am not sure if that is okay in Sankey diagrams or not?
