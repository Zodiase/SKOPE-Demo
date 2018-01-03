## Meteor App

### The config file (`meteor-settings.json`)

The purpose of using this file is to easily use different sets of configurations for different deployments.

Note that per Meteor design, only `public` field is exposed to client-side.

- `public.elasticEndpoint` defines what endpoint the SearchKit should be using for querying.
    Since we are using Meteor to proxy the request to the Elastic Search, this should point to the proxy endpoint.
    (The proxy code actually reads this value to setup the endpoint.)
- `server.elasticEndpoint` defines where the elastic search server endpoint is. This is used by the proxy to forward search queries.

### Conventions

- `Meteor.methods`
    - Method names should be descriptive and in the form of `<entity>.<action>`. For example:
        - `userAge.get`
        - `userOccupation.set`
        - `post.delete`
        - `authentication.invalidate`
    - Instead of taking multiple arguments, use a dictionary of arguments so they are named and unordered. For example:

        ```JavaScript
        Meteor.methods({
          'book.find' ({
            author,
            genre,
            publisher,
          }) {
            //...
          },
        });
        ```
- Code splitting
    - UI components
        - If a UI component is designed to be reusable and generic, put it under `/imports/ui/components`.
        - Otherwise, stick it close to the parent component that's using it.
            - For example, if we are splitting a small component out of a page, and that component would only make sense in the context of that page (a.k.a not generic), then that component is better located right inside the folder for that page.
    - Redux actions/reducers
        - Actions and reducers should stay inside their corresponding folders under `/imports/ui/redux-store`.
        - Multiple actions or reducers could be defined within single files if they belong to the same scope and are naive enough.
    - Simple helper functions (that only deals with data structure and math or is only used for development) could sit inside `/imports/ui/helpers.js`.
