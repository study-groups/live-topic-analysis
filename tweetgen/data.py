import json
import sys
import time

def gen_tweets(filename):
    with open(filename) as f:
        objects=json.load(f)  # returns Python List of Dicts
    i = 0   
    while i < len(objects):
        yield objects[ i ]
        i += 1

def main():
    filename=sys.argv[1]
    delayMs=sys.argv[2]
    for i, object in enumerate(gen_tweets(filename)):
        sys.stdout.write(json.dumps(object))
        time.sleep(float(delayMs)/1000)

    sys.stdout.flush()
if __name__ == "__main__": main()
