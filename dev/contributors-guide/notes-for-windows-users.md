
windows versions of what you need
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

c++ compiler (we recommend visual studio express)
 - you will need to log in using a Microsoft account
 - http://www.visualstudio.com/products/visual-studio-express-vs
     - (look for "free visual studio" near the top-right of the page)

nodejs
 - http://nodejs.org

naturaldocs
 - for building the documentation
 - http://www.naturaldocs.org/download.html

perl (we recommend ActiveState's perl distribution)
 - for naturaldocs
 - http://www.activestate.com/activeperl/downloads

git
 - http://git-scm.com/download

To install naturaldocs, unpack the archive somewhere in your filesystem (we
recommend "C:\naturaldocs").  Edit the "NaturalDocs.bat" file and change the
line near the bottom:

Change this line:

    perl NaturalDocs ...

To this line:

    perl "C:\naturaldocs\NaturalDocs" ...

Adjust the line depending on where you unpacked the archive.

Finally, add the unpacked location to your system Path variable:

Note that these instructions are for Windows 7.
 - browse to the following:
     - "Control Panel"
     - "System and Security"
     - "System"
     - "Advanced system settings"
     - "Environment Variables"
 - Under "System variables", double click on "Path"
 - Under "Variable value", add a semicolon (";") followed by the unpacked
   location to the end of any text already there
     - for example:
     ```
     ORIGINAL_TEXT;C:\naturaldocs
     ```


Working on torusvis
~~~~~~~~~~~~~~~~~~~

Some parts of the nodejs stack require administrative privledges.  We recommend
that you create a shortcut to the command prompt; either on your desktop or by
pinning to the task bar.
 - click on the start menu
 - type "cmd" in the search area
 - right click on the "cmd" application that appears and select "pin to
   taskbar".
 - from now on, you can open a terminal with administrator privledges by right
   clicking on the new icon, right clicking on "Command Prompt" and selecting
   "Run as administrator"

Start by cloning the repository:

    git clone git://github.com/opadron/torusvis.git
    cd torusvis

Next, install all dependencies.  They will be placed under "node_modules":

    npm install

Or, if you do not want to install the optional dependencies (such as jquery):

    npm install --no-optional

To build everything and run the unit tests:

    .\node_modules\.bin\grunt

Under "dev\build", you will find an uncompressed library ("torusvis.js"), a
compressed library ("torusvis.min.js"), a source map for the compressed library
("torusvis.min.map"), and the reference documentation in html format ("docs/").

To run the demo server:

    .\node_modules\.bin\grunt demo

Browse to "localhost:5000":
 - example applications are under "/examples"
 - publication materials are under "/pubs"
   - "/cug-2014/text/paper.pdf" -- CUG 2014 paper
   - "/cug-2014/slides" -- CUG 2014 presentation slides
 - API documentation is under "/docs/html" and "/docs/framedHtml"
 - To shut the server down, browse to "/quit"

