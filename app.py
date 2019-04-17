from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, desc, and_
from flask_jsglue import JSGlue
import json
from config import Config
#This is the main class that handles server side requests

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:admin123@localhost/customer_info'
db=SQLAlchemy(app)
jsglue=JSGlue(app)
app.config.from_object(Config)

#model class
class Data(db.Model):
    __tablename__ = "customer_detail"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    mobile1 = db.Column(db.String(20))
    mobile2 = db.Column(db.String(20))
    mobile3 = db.Column(db.String(20))
    address = db.Column(db.String(500))
    active_status = db.Column(db.String(1))

    def __init__(self, name, mobile1, mobile2, mobile3, address):
        self.name = name
        self.mobile1 = mobile1
        self.mobile2 = mobile2
        self.mobile3 = mobile3
        self.address = address
        self.active_status = "Y"

    @property
    def serialize(self):
        return {'name' : self.name,
        'mobile1' : self.mobile1,
        'mobile2' : self.mobile2,
        'mobile3' : self.mobile3,
        'address' : self.address,
        'id' : self.id}

@app.route("/index", methods=['post','get'])
@app.route("/", methods=['post','get'])
def index():
    form_data = {'data': None}
    if request.method == 'GET' and (request.args.get("action") != None and request.args.get("action") == 'edit'):
        cust_id = request.args.get("id")
        cust_info = db.session.query(Data).filter(Data.id == cust_id).first()
        form_data = {'data': cust_info}
        return render_template('index.html', data = form_data)

    return render_template("index.html", data = form_data)

@app.route("/search", methods=['post','get'])
def search():
    if request.method=='POST':
        name = request.form['name'].capitalize()
        mobile1 = request.form['mobile1']
        mobile2 = request.form['mobile2']
        mobile3 = request.form['mobile3']
        address = request.form['address']
        # # TODO: Add logic to stop user from entering duplicate mobile number in either of the fields (mobile1,mobile2 or mobile3)
        # if db.session.query(Data).filter(or_(Data.mobile1 == mobile1, Data.mobile2 == mobile1, Data.mobile3 = mobile1))
        id_to_upate = request.form['id']
        if id_to_upate != '':
            data = Data.query.filter_by(id = id_to_upate).first()
            data.name = name
            data.mobile1 = mobile1
            data.mobile2 = mobile2
            data.mobile3 = mobile3
            data.address = address
        else:
            data = Data(name, mobile1, mobile2, mobile3, address)
            db.session.add(data)
        db.session.commit()
    return render_template('search.html')

def fetch_all_details():
    list = db.session.query(Data).filter(Data.active_status == "Y").order_by(Data.name)
    return list

@app.route("/delete_cust", methods=['post'])
def delete_cust():
    id_to_delete = request.form['id_to_delete']
    if id_to_delete != None:
        data = Data.query.filter_by(id = id_to_delete).first()
        data.active_status = "N"
        db.session.commit()
        return app.response_class(json.dumps(True), content_type='application/json')
    return app.response_class(json.dumps(False), content_type='application/json')

@app.route('/filter', defaults={'page_num':1}, methods=['get'])
@app.route('/filter/<int:page_num>', methods=['get'])
def filter(page_num):
    if request.method=='GET':
        filter_criteria = request.args.get("query")

        if filter_criteria != "":
            like_filter_criteria = "%" + filter_criteria + "%"
            search_results = db.session.query(Data).filter(or_(Data.mobile1.like(like_filter_criteria),
            Data.mobile2.like(like_filter_criteria),
            Data.mobile3.like(like_filter_criteria))).filter(and_(Data.active_status == "Y")).order_by(Data.name)
        else:
            search_results = fetch_all_details()

        if search_results != None:
            paginationObj = search_results.paginate(per_page=3,page=page_num,error_out=True)
            num_list = []
            for i in paginationObj.iter_pages(left_edge = 3, right_edge = 3, left_current = 3, right_current = 3):
                num_list.append(i)
            return jsonify({'json_list' : [i.serialize for i in paginationObj.items],
            'pages_lst' : num_list})

if __name__ == '__main__':
    app.debug=True
    app.run()
