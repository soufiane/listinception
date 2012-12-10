
id = "meow"

list = {
  title: "Lorem ipsum dolor sit adem",
  parents: [id, id], # a list can be a child of multiple lists
  tree_id: id, # get the route tree
  ancestors: [id,id,id]
}

# 1. Move a list

l = {
  id: 9,
  title: "ListInception Final Product",
  ancestors: [],
  parents: [],
  created_at: new Date,
}


l0 = {
  id: 0,
  title: "List Prototype",
  ancestors: [],
  parents: [],
  created_at: new Date,
}

l1 = {
  id: 1,
  title: "Features",
  ancestors: [l0.id],
  parents: [l0.id],
  created_at: new Date,
}

l2 = {
  id: 2,
  title: "Nice to have features",
  ancestors: [l0.id, l.id],
  parents: [l0.id, l.id],
  created_at: new Date
}

l3 = {
  id: 3,
  title: "Users",
  ancestors: [l0.id, l1.id],
  parents: [l1.id],
  created_at: new Date
}

l8 = {
  id: 8,
  title: "Embedding",
  ancestors: [l0.id, l2.id],
  parents: [l2.id],
  created_at: new Date
}

l9 = {
  id: 9,
  title: "Use embed.ly",
  ancestors: [l0.id, l2.id, l8.id],
  parents: [l8.id],
  created_at: new Date
}

l4 = {
  id: 4,
  title: "Login",
  ancestors: [l0.id, l1.id, l3.id],
  parents: [l3.id],
  created_at: new Date
}

l5 = {
  id: 5,
  title: "Social login",
  ancestors: [l0.id, l1.id, l3.id, l4],
  parents: [l4.id],
  created_at: new Date
}

l6 = {
  id: 6,
  title: "Facebook login",
  ancestors: [l0.id, l1.id, l3.id, l4, l5],
  parents: [l5.id],
  created_at: new Date
}

l7 = {
  id: 7,
  title: "Use Facebook Javascipt SDK"
  ancestors: [l0.id, l1.id, l3.id, l4, l5,l6],
  parents: [l6.id],
  created_at: new Date
}

lists = [l3,l1,l8,l9,l4,l0,l2,l,l6,l5,l7]


###

  tree = {
    title: ""
    childrens: [the actual childs]
  }


  1. Store the documents in couchdb
  2. Query all the docs by a user
    1. index user field
  3. render them
    1. transform them

###

renderTree = (tree) ->
  renderedTree = {}

  roots = {}
  store = {
    id: {},
    parent: {}
  }

  meow = tree

  ###
  # sort the list
  tree.sort (a,b) ->
    a.id - b.id
  ###

  # construct the store by id
  meow.forEach (m) ->
    m.childrens = []
    store.id[m.id] = m
    m.parents.forEach (p) ->
      store.parent[p] = m

  meow.forEach (m) ->
    # now we have the root tree
    # add all the childrens inside a parent.
    # if parent get the parent
    # add the node as a child
    # how to know that an element is a root element
    # it doesn't have ancestors newther parents
    ###
    if (m.parents is null and m.ancestors.length is 0)
      roots[m.id] = m

    if (m.parents)
      # add the node to it's place
      if (roots[m.parents])
        roots[m.parents].childrens.push m
    ###
    # node is root
    if (m.parents is [] and m.ancestors.length is 0)
      roots[m.id] = m
    else
      m.parents.forEach (p) ->
        store.id[p].childrens.push(m)
      #store.id[m.parents].childrens.push(m)



  return store.id

renderedTree = renderTree lists
console.log renderedTree
