from flask import Flask,jsonify,request
from flask import render_template
import ast

app = Flask(__name__)
tags = []
times = []
@app.route("/")
def get_chart_page():
        global tags, times
        tags = []  #will these overwrite past results?
        times = [] #
        return render_template('chart.html', values=times, labels=tags)
@app.route('/refreshData')
def refresh_graph_data():
        global tags, times
        print("tags now: " + str(tags))
        print("times now: " + str(times))
        return jsonify(sLabel=tags, sData=times)
@app.route('/updateData', methods=['POST'])
def update_data():
        global tags, times
        if not request.form or 'data' not in request.form:
            return "error",400
        tags = ast.literal_eval(request.form['tags']) #s/b append once this works
        times = ast.literal_eval(request.form['times']) #s/b append once this works
        print("tags received: " + str(tags))
        print('tags type is: ', type(tags))
        print("times received: " + str(times))
        print("times type is: ", type(times))
        return "success",201
if __name__ == "__main__":
        app.run(host='localhost', port=9991) 
