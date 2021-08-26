# simple package concatenation. Add files to array,
# all files will be cat'd to stdout and turned into
# one long string that is passed to node via -e flag.

# To run:
# source test.sh

files=(
../RingBuffer.js 
#./test-createRingBuffer.js
./testRingBuffer.js

)
# -i interactive, -e execute text as script
code="$(cat ${files[@]} )"
node -i -e "$code"
