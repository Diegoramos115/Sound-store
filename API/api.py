from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import jwt
import datetime

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": ["http://localhost:5500", "http://127.0.0.1:5500"]}})


app.config['SECRET_KEY'] = 'mi_clave_secreta'


db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  
    'database': 'tienda_electronica'
}


@app.route('/login', methods=['POST'])
def login():
    datos = request.json
    nombre_usuario = datos.get('nombre_usuario')
    contrasena = datos.get('contrasena')

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM usuarios WHERE nombre_usuario = %s AND contrasena = %s", (nombre_usuario, contrasena))
    usuario = cursor.fetchone()

    cursor.close()
    conn.close()

    if usuario:

        token = jwt.encode({
            'user_id': usuario['id'],
            'nombre_usuario': usuario['nombre_usuario'],
            'rol': usuario['rol'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'success': True, 'mensaje': 'Login exitoso', 'token': token})
    else:
        return jsonify({'success': False, 'mensaje': 'Credenciales incorrectas'}), 401



def verificar_token():
    token = request.headers.get('Authorization')
    if not token:
        return {'success': False, 'mensaje': 'Token no proporcionado'}, 403
    
    try:
        token = token.split(" ")[1]  
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
       
        return data
    except jwt.ExpiredSignatureError:
        return {'success': False, 'mensaje': 'El token ha expirado'}, 401
    except jwt.InvalidTokenError:
        return {'success': False, 'mensaje': 'Token inválido'}, 401



@app.route('/productos', methods=['POST'])
def crear_producto():
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]
    
    if 'rol' in data and data['rol'] == 'administrador':
        producto = request.json
        nombre = producto.get('nombre')
        descripcion = producto.get('descripcion')
        precio = producto.get('precio')
        stock = producto.get('stock')
        ubicacion_imagen = producto.get('ubicacion_imagen')
        categoria = producto.get('categoria')

        if not nombre or not precio or stock is None:
            return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("INSERT INTO productos (nombre, descripcion, precio, stock, ubicacion_imagen, categoria) VALUES (%s, %s, %s, %s, %s, %s)", 
                           (nombre, descripcion, precio, stock, ubicacion_imagen, categoria))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Producto creado exitosamente'}), 201
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede crear productos'}), 403



@app.route('/productos/<int:id>', methods=['PUT'])
def actualizar_producto(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]
    
    if 'rol' in data and data['rol'] == 'administrador':
        producto = request.json
        nombre = producto.get('nombre')
        descripcion = producto.get('descripcion')
        precio = producto.get('precio')
        stock = producto.get('stock')
        ubicacion_imagen = producto.get('ubicacion_imagen')
        categoria = producto.get('categoria')

        if not nombre or not precio or stock is None:
            return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("UPDATE productos SET nombre = %s, descripcion = %s, precio = %s, stock = %s, ubicacion_imagen = %s, categoria = %s WHERE id = %s",
                           (nombre, descripcion, precio, stock, ubicacion_imagen, categoria, id))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Producto actualizado exitosamente'}), 200
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede actualizar productos'}), 403



@app.route('/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]
    
    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("DELETE FROM productos WHERE id = %s", (id,))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Producto eliminado exitosamente'}), 200
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede eliminar productos'}), 403



@app.route('/productos/<int:id>', methods=['GET'])
def obtener_producto(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM productos WHERE id = %s", (id,))
            producto = cursor.fetchone()

            cursor.close()
            conn.close()

            if producto:
                return jsonify({'success': True, 'producto': producto})
            else:
                return jsonify({'success': False, 'mensaje': 'Producto no encontrado'}), 404
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede ver los productos'}), 403



@app.route('/productos', methods=['GET'])
def obtener_productos():
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    categoria = request.args.get('categoria')

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        if categoria:
            cursor.execute("SELECT * FROM productos WHERE categoria = %s", (categoria,))
        else:
            cursor.execute("SELECT * FROM productos")

        productos = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'success': True, 'productos': productos})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500

@app.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
            usuario = cursor.fetchone()

            cursor.close()
            conn.close()

            if usuario:
                return jsonify({'success': True, 'usuario': usuario})
            else:
                return jsonify({'success': False, 'mensaje': 'Usuario no encontrado'}), 404
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede ver los usuarios'}), 403



@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM usuarios")
            usuarios = cursor.fetchall()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'usuarios': usuarios})
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede ver los usuarios'}), 403



@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    usuario = request.json
    nombre_usuario = usuario.get('nombre_usuario')
    correo = usuario.get('correo')
    contrasena = usuario.get('contrasena')
    nombre_completo = usuario.get('nombre_completo')
    telefono = usuario.get('telefono')
    direccion = usuario.get('direccion')
    rol = usuario.get('rol', 'cliente')  

    if not nombre_usuario or not correo or not contrasena or not nombre_completo:
        return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO usuarios (nombre_usuario, correo, contrasena, nombre_completo, telefono, direccion, rol) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                       (nombre_usuario, correo, contrasena, nombre_completo, telefono, direccion, rol))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'success': True, 'mensaje': 'Usuario creado exitosamente'}), 201
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500


@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        usuario = request.json
        nombre_usuario = usuario.get('nombre_usuario')
        correo = usuario.get('correo')
        contrasena = usuario.get('contrasena')
        nombre_completo = usuario.get('nombre_completo')
        telefono = usuario.get('telefono')
        direccion = usuario.get('direccion')
        rol = usuario.get('rol')

        if not nombre_usuario or not correo or not contrasena or not nombre_completo or not rol:
            return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("UPDATE usuarios SET nombre_usuario = %s, correo = %s, contrasena = %s, nombre_completo = %s, telefono = %s, direccion = %s, rol = %s WHERE id = %s",
                           (nombre_usuario, correo, contrasena, nombre_completo, telefono, direccion, rol, id))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Usuario actualizado exitosamente'}), 200
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede actualizar usuarios'}), 403



@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Usuario eliminado exitosamente'}), 200
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede eliminar usuarios'}), 403


@app.route('/api/ordenes', methods=['GET'])
def obtener_ordenes():
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM ordenes")
            ordenes = cursor.fetchall()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'ordenes': ordenes})
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede ver las órdenes'}), 403

@app.route('/api/ordenes/<int:id>', methods=['GET'])
def obtener_orden(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor(dictionary=True)

            cursor.execute("SELECT * FROM ordenes WHERE id = %s", (id,))
            orden = cursor.fetchone()

            if not orden:
                cursor.close()
                conn.close()
                return jsonify({'success': False, 'mensaje': 'Orden no encontrada'}), 404

            cursor.execute("SELECT * FROM detalles_ordenes WHERE orden_id = %s", (id,))
            detalles = cursor.fetchall()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'orden': orden, 'detalles': detalles})
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede ver las órdenes'}), 403



@app.route('/api/ordenes', methods=['POST'])
def crear_orden():
    data = request.get_json()
    usuario_id = data.get('usuario_id')
    estado = data.get('estado', 'pendiente')
    monto_total = data.get('monto_total')
    detalles = data.get('detalles', [])


    print(f"Datos recibidos: usuario_id={usuario_id}, estado={estado}, monto_total={monto_total}, detalles={detalles}")

    if not usuario_id or not monto_total or not detalles:
        return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO ordenes (usuario_id, estado, monto_total, actualizado_en) VALUES (%s, %s, %s, NOW())",
                       (usuario_id, estado, monto_total))
        orden_id = cursor.lastrowid

        detalles_data = [(orden_id, detalle['producto_id'], detalle['cantidad'], detalle['precio']) for detalle in detalles]
        cursor.executemany("INSERT INTO detalles_ordenes (orden_id, producto_id, cantidad, precio) VALUES (%s, %s, %s, %s)", detalles_data)

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'success': True, 'mensaje': 'Orden creada exitosamente'}), 201
    except mysql.connector.Error as err:
        print(f"Error en la base de datos: {err}")
        return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500


@app.route('/api/ordenes/<int:id>', methods=['PUT'])
def actualizar_estado_orden(id):
    data = verificar_token()
    if isinstance(data, tuple):
        return jsonify(data[0]), data[1]

    if 'rol' in data and data['rol'] == 'administrador':
        estado = request.json.get('estado')

        if not estado:
            return jsonify({'success': False, 'mensaje': 'Faltan datos obligatorios'}), 400

        try:
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("UPDATE ordenes SET estado = %s, actualizado_en = NOW() WHERE id = %s", (estado, id))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({'success': True, 'mensaje': 'Estado de la orden actualizado exitosamente'}), 200
        except mysql.connector.Error as err:
            return jsonify({'success': False, 'mensaje': f'Error en la base de datos: {err}'}), 500
    else:
        return jsonify({'success': False, 'mensaje': 'Acceso denegado. Solo admin puede actualizar el estado de las órdenes'}), 403
if __name__ == '__main__':
    app.run(debug=True)