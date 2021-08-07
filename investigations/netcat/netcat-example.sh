create-pseudo-stream() {
  while read line; do
    echo "$line"
  done < /dev/stdin | nc localhost 4444
}

listen-on-port() {
  local port="$1";
  nc -l "$port"
}
