from flask import Flask, request, render_template, redirect, url_for, session, jsonify # type: ignore

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = 'your-secret-key'


branches = [
    {"name": "Nasr City Branch", "url": "https://g.co/kgs/aRyqNdD", "phone": "+20 123-456-7890"},
    {"name": "Zamalek Branch", "url": "https://g.co/kgs/VkuUzwW", "phone": "+20 987-654-3210"},
    {"name": "New Cairo 1 Branch", "url": "https://g.co/kgs/uAURBNm", "phone": "+20 456-789-0123"},
    {"name": "Maadi Branch", "url": "https://g.co/kgs/t6yYCV3", "phone": "+20 654-321-0987"},
    {"name": "Heliopolis Branch", "url": "https://g.co/kgs/nZnXcsi", "phone": "+20 789-012-3456"},
]

reservations = []

@app.route("/")
def index():
    return redirect(url_for("account"))


accounts={"testuser@example.com": "password123"}
@app.route("/account", methods=["GET", "POST"])
def account():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        if email in accounts and accounts[email] == password:
            session['user'] = email
            return redirect(url_for('home'))  
        else:
           error_message = "Login failed. Incorrect username or password."
           return render_template("account.html", error_message=error_message)
    return render_template("account.html")

@app.route("/create", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        
        fullname = request.form.get("fullname", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()
        phone = request.form.get("phone", "").strip()

       
        if not fullname or not email or not password or not phone:
            return "All fields are required. Please fill out the form completely.", 400

        
       
        accounts[email] = password
    
        return redirect(url_for("account"))

    return render_template("createacc.html")


@app.route("/home")
def home():
    if 'user' not in session:
        return redirect(url_for("account"))
    return render_template("home.html")

@app.route('/reservation')
def reservation():
    return render_template('reservation.html', branches=branches)

@app.route('/submit-reservation', methods=['POST'])
def submit_reservation():
    try:
        data = request.get_json()  
        
        if not data.get('name') or not data.get('email') or not data.get('phone') or not data.get('branch') or not data.get('date') or not data.get('time') or not data.get('guests'):
            return jsonify({'error': 'All fields are required!'}), 400
        
        
        reservation_details = {
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'branch': data['branch'],
            'date': data['date'],
            'time': data['time'],
            'guests': data['guests'],
        }
        
        
        return jsonify({'reservation_details': reservation_details})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/branches")
def branches_view():
    return render_template("branches.html", branches=branches)

@app.route("/menu", methods=["GET", "POST"])
def menu():
    menu_items = {
        "Sushi": [
            {"name": "Fried Rolls", "price": 50},
            {"name": "Volcano", "price": 70},
            {"name": "Oshi", "price": 65},
            {"name": "ura maki", "price": 50},
            {"name": "salmon and shrimp", "price": 80},
            {"name": "foto maki", "price": 50},
            {"name": "shrimp triffle", "price": 90},
            {"name": "cheese cream", "price": 75},
            {"name": "salmon avocado", "price": 175},
            {"name": "avocado caterpillar", "price": 150},
            
        ],
        "Desserts": [
            {"name": "Chocolate Cake", "price": 150},
            {"name": "Berries Cheesecake", "price": 250},
            {"name": "Volcano Cup", "price": 150},
            {"name": "Banana rolls", "price": 165},
            {"name": "brownie cookie", "price": 235},
            
        ]
    }

    if request.method == "POST":
        selected_items = request.form.getlist("menu-item")
        quantities = request.form.getlist("quantity")
        order = [{"item": item, "quantity": int(quantity)} for item, quantity in zip(selected_items, quantities) if int(quantity) > 0]

        if 'cart' not in session:
            session['cart'] = []
        session['cart'].extend(order)
        session.modified = True  

        return render_template("order_summary.html", order=order)
    
    return render_template("menu.html", menu=menu_items)

@app.route("/online", methods=["GET", "POST"])
def online():
    if request.method == "POST":
        menu_item = request.form.get("menu-item")
        quantity = request.form.get("quantity")
        customer_name = request.form.get("customer-name")
        customer_phone = request.form.get("customer-phone")
        customer_address = request.form.get("customer-address")
        payment_method = request.form.get("payment-method")

        try:
            quantity = int(quantity) if quantity else 0  
        except ValueError:
            quantity = 0 

        
        if not menu_item or not customer_name or not customer_phone or not customer_address or not payment_method:
            return render_template("online.html", error="Please fill in all required fields.")

        prices = {
            "Fried Rolls": 50,
            "Volcano": 70,
            "Chocolate Cake": 150,
        }
        price = prices.get(menu_item, 0) * quantity

        order = {
            "menu_item": menu_item,
            "quantity": quantity,
            "customer_name": customer_name,
            "customer_phone": customer_phone,
            "customer_address": customer_address,
            "payment_method": payment_method,
            "total_price": price,
        }

        if 'cart' not in session:
            session['cart'] = []
        session['cart'].append(order)
        session.modified = True

        return render_template("online.html", order=order)
    
    return render_template("online.html")


@app.route("/payment", methods=["GET", "POST"])
def payment():
    if request.method == "POST":
        card_number = request.form.get("card-number")
        expiry_date = request.form.get("expiry-date")
        cvv = request.form.get("cvv")
        amount = float(request.form.get("amount"))

        if not (card_number and expiry_date and cvv and amount > 0):
            error_message = "All fields are required, and the amount must be positive."
            return render_template("payment.html", error_message=error_message)

        success_message = "Payment processed successfully! Thank you."
        return render_template("payment.html", success_message=success_message)
    
    return render_template("payment.html")
@app.route("/sushi")
def sushi():
    return render_template("sushi.html")

@app.route("/dessert")
def dessert():
    return render_template("dessert.html")




if __name__ == "__main__":
    app.run(debug=True)