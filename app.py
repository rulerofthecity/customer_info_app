from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, desc
import json

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:admin123@localhost/customer_info'
db=SQLAlchemy(app)

class Data(db.Model):
    __tablename__ = "customer_detail"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    mobile1 = db.Column(db.String(20))
    mobile2 = db.Column(db.String(20))
    mobile3 = db.Column(db.String(20))
    address = db.Column(db.String(500))

    def __init__(self, name, mobile1, mobile2, mobile3, address):
        self.name = name
        self.mobile1 = mobile1
        self.mobile2 = mobile2
        self.mobile3 = mobile3
        self.address = address

    @property
    def serialize(self):
        return {'name' : self.name,
        'mobile1' : self.mobile1,
        'mobile2' : self.mobile2,
        'mobile3' : self.mobile3,
        'address' : self.address}

@app.route("/index")
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search", methods=['post','get'])
def search():
    if request.method=='POST':
        name = request.form['name'].capitalize()
        mobile1 = request.form['mobile1']
        mobile2 = request.form['mobile2']
        mobile3 = request.form['mobile3']
        address = request.form['address']

        print(name, mobile1, mobile2, mobile1, address)
        # # TODO: Add logic to stop user from entering duplicate mobile number in either of the fields (mobile1,mobile2 or mobile3)
        # if db.session.query(Data).filter(or_(Data.mobile1 == mobile1, Data.mobile2 == mobile1, Data.mobile3 = mobile1))

        data = Data(name, mobile1, mobile2, mobile3, address)
        db.session.add(data)
        db.session.commit()

    # list = fetch_all_details()
    return render_template('search.html')

def fetch_all_details():
    #just return 10 rows
    list = db.session.query(Data).order_by(desc(Data.id)).limit(10)
    print(list)
    return list

@app.route("/filter", methods=['get'])
def filter():
    print(request)
    if request.method=='GET':
        filter_criteria = request.args.get("query")
        print(filter_criteria)

        if filter_criteria != "":
            like_filter_criteria = "%" + filter_criteria + "%"
            search_results = db.session.query(Data).filter(or_(Data.mobile1.like(like_filter_criteria),
            Data.mobile2.like(like_filter_criteria),
            Data.mobile3.like(like_filter_criteria))).order_by(Data.name)
            print(search_results)
        else:
            search_results = fetch_all_details()

        if search_results != None:
                # return json.dumps({'status':'OK','result':jsonify(search_results)})
            return jsonify({'json_list' : [i.serialize for i in search_results.all()]})


# def fetch_details(self, name, mobile_num):
#     if name == None and mobile_num == None:
#         list = db.session.query(Data)
#         print(type(list))
#         print(list)
#
#
# def fetch_all_details(query):
#     print()

if __name__ == '__main__':
    app.debug=True
    app.run()
