from flask import Flask,jsonify,request
from flask import render_template
import ast

app = Flask(__name__)
state = {}
tags = []
times = []
@app.route("/")
def get_chart_page():
        global tags, times
        return render_template('chart.html', times=times, tags=tags)
@app.route('/refreshData')
def refresh_graph_data():
        global tags, times
        #print("tags now: " + str(tags))
        #print("times now: " + str(times))
        print(jsonify(sLabel=tags, sData=times))
        return jsonify(sLabel=tags, sData=times)
@app.route('/updateData', methods=['POST'])
def update_data():
        global tags, times
        print('form:',request.form)
        #print(request.form.getlist('times'))
        if not request.form or 'times' not in request.form:
            print('no data or no form')
            return "error",400
        #if times is None or tags is None:
        #    print('null data')
        #    return "error",400
        #tags = tags.append(ast.literal_eval(request.form['tags']))
        #times = times.append(ast.literal_eval(request.form['times']))
        [tags.append(x) for x in request.form.getlist('tags')]
        [times.append(x) for x in request.form.getlist('times')]
        #print("tags: " + str(tags)) 
        #print('tags type is: ', type(tags)) 
        #print("times: " + str(times))
        #print("times type is: ",type(times))
        return "success",201
if __name__ == "__main__":
        app.run(host='0.0.0.0', port=9991) 

