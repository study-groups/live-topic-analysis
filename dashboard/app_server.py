from flask import Flask,jsonify,request
from flask import render_template
import ast

app = Flask(__name__)
state = {'labels':[]}
tags = []
times = []
@app.route("/")
def get_chart_page():
        #global state
        return render_template('chart.html')
@app.route('/refreshData')
def refresh_graph_data():
        global state
        #print(jsonify(state))
        return jsonify(state)
@app.route('/updateData', methods=['POST'])
def update_data():
        global state
        if not request.form:
            print('no data or no form')
            return "error",400
        batch = request.form.to_dict()
        print("Received: ", batch)
        #Update state with the latest batch
        for key in batch.keys():
            if key not in state.keys():
                #create key with zeroes activity to align chart
                state[key] = [0 for _ in state['labels']]
            state[key].append(batch[key])
        state['labels'].append('')
        return "success",201
if __name__ == "__main__":
        app.run(host='0.0.0.0', port=9991) 




#print(batch)

#>>>{'trump':50, 'cohen':23}



#print(state)

#>>>{'trump': [50], 'cohen': [23], 'labels': ['']}
