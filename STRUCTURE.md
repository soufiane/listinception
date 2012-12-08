# STRUCTURE

  General information about the structure of the project.

## Components
 
  Build using independant components, every copmponent does only 1 thing and expose an api.
  This we can have a lot fo flexibility and we will be able to change things without affecting other components.

  ######Example:
    - A component can use coffeescript or even another programming language and it doesn't matter, because it exposes the same rest api
    - We can use different build systems or different test framework for each component
    - etc ...


## File layouts
  
 - lib/

    - app-server (boot the app)

    - list (list model) 
    - list-rest (list rest api, all other components only communicate with it)
    - list-front (front end, render views, list public page ...)
    
    - user (user model)
    - user-rest (user rest api)
    - user-front (render pages, profile, login, signup)

## Naming conventions

  - camelCase javascript names
  - Use a hyphen to separate components, e.x list-rest, embed-rest, upload-rest
  - Namespace every private components ex: listinception.list-api
