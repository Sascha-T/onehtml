# OneHtml
Turn a html file with refrences to js files (local files or external files) into **one** html file with no external refrences.

# How it works when compressing
  Find refrences to js files\
  GZIP them\
  Base64 the GZIPPED scripts\
  Cut them together with each script having its own variable in the html file\
  Put (https://github.com/jsxgraph/jsxgraph/blob/master/JSXCompressor)[JSXCompressor] into the html file (base64'd)\
  **Done**

# How it works at runtime
  Unbase64 JSXCompressor\
  Unbase64 the variables and gunzip them\
  Eval them in order\
  **Done! You should now have the same file as before but with no refrences to files not contained in the html file**
  
# Use cases
  There are limited use cases:
  - You could use this for a school project/presentation at work if
    - Your school/workplace doesn't have internet\
      or
    - Your school/workplace has whitelisted domains and anything else gets blocked
  
# License
  This project is licensed under the LGPL v3. See LICENSE\
  JSXCompressor (ziplib.comp) is licensed under the LGPL v3. See LICENSE-jsxcompressor
# Planned
  CSS support
