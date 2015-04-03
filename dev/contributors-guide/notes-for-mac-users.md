
mac versions of what you need
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

c++ compiler (clang comes with xcode)

perl (should already be installed on mac os)

naturaldocs
 - for building the documentation
 - we recommend using homebrew
   - http://brew.sh

    brew install naturaldocs


git
 - http://git-scm.com/download
 - or, use homebrew

    brew install git

nodejs
 - http://nodejs.org
 - or, use homebrew

    brew install node

Working on torusvis
~~~~~~~~~~~~~~~~~~~

Start by cloning the repository:

    git clone git://github.com/opadron/torusvis.git
    cd torusvis

Next, install all dependencies.  They will be placed under "node_modules":

    npm install

Or, if you do not want to install the optional dependencies (such as jquery):

    npm install --no-optional

install grunt globally:

    npm install -g grunt-cli

To build everything and run the unit tests:

    grunt

Under "dev\build", you will find an uncompressed library ("torusvis.js"), a
compressed library ("torusvis.min.js"), a source map for the compressed library
("torusvis.min.map"), and the reference documentation in html format ("docs/").

To run the demo server:

    grunt demo

Browse to "localhost:5000":
 - example applications are under "/examples"
 - publication materials are under "/pubs"
   - "/cug-2014/text/paper.pdf" -- CUG 2014 paper
   - "/cug-2014/slides" -- CUG 2014 presentation slides
 - API documentation is under "/docs/html" and "/docs/framedHtml"
 - To shut the server down, browse to "/quit"

