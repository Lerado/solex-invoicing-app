We're really glad you're reading this, because we need volunteer developers to help this project come to fruition. 👏

## Instructions

These steps will guide you through contributing to this project:

- Fork the repo
- Clone it and install dependencies

		git clone https://mohlahsolutions@dev.azure.com/mohlahsolutions/Solex/_git/SolexInvoicing
		yarn install
- Install husky hooks for conventional commits

		yarn husky install

Keep in mind that after running `yarn install` the git repo is reset. So a good way to cope with this is to have a copy of the folder to push the changes, and the other to try them.

Make and commit your changes. Make sure the commands `yarn build` and `npm run test` are working.

Finally send a [GitHub Pull Request](https://dev.azure.com/mohlahsolutions/Solex/_git/SolexInvoicing/pullrequests) with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).
