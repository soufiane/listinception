###

  POST /lists -> create a list
  POST /lists -> add a list to a list
  get the parent get it's ancestors
  add the ancestors to the new created element
  add the parent.id to it's parents
  create it.
    {
      parents: []
    }

  home page
  Get all the lists by the logged in user
  db.lists.find({user: 'soufiane'}) # get all the lists

  # sort them
  # render them
 

  # on new list, get the list and it's ancestors

  # display one list
  # get the list and all the childrens of it
  # db.lists.find({ancestors: list._id})
  # sort them
  # render the list


  Indexes
  1. user
  2. parents
  3. ancestors

###
