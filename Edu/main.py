from fastapi import FastAPI, Query
import pymysql
import psycopg2
import requests
import psycopg2
import psycopg2.extras
from typing import Dict, Any
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- MySQL connection -------------------
def get_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="edudb123",
        port=3306,
        cursorclass=pymysql.cursors.DictCursor
    )

# ------------------- PostgreSQL connection -------------------
def get_postgres_connection():
    return psycopg2.connect(
        host="localhost",
        user="postgres",
        password="admin",
        database="bookdbS",
        port=5432
    )


# ------------------- UTILISATEURS -------------------
@app.get("/users")
async def fetch_all():
    try:
        connection = get_connection()
        with connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users")
                users = cursor.fetchall()
        return {"users": users}
    except Exception as e:
        return {"error": str(e)}


@app.post("/users")
async def create_user(formData: dict):
    name = formData["name"]
    email = formData["email"]
    password = formData["password"]
    departement = formData["departement"]
    if not name or not email or not password:
        return {"error": "Name, email, and password are required"}
    try:
        connection = get_connection()
        with connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO users (name, email, password, departement) VALUES (%s, %s, %s, %s)",
                    (name, email, password, departement)
                )
            connection.commit()
        return {"message": "User created successfully"}
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/admin/stats")
def get_stats() -> Dict[str, Any]:
    try:
        # Connexion MySQL
        mysql_conn = get_connection()
        with mysql_conn.cursor() as cursor:
            # Total users
            cursor.execute("SELECT COUNT(*) AS total_users FROM users;")
            total_users = cursor.fetchone()["total_users"]

            # Total formations
            cursor.execute("SELECT COUNT(*) AS total_formations FROM formations;")
            total_formations = cursor.fetchone()["total_formations"]

            # Total cours_commences
            cursor.execute("SELECT COUNT(*) AS total_courses FROM cours_commences;")
            total_courses = cursor.fetchone()["total_courses"]

            # Utilisateurs par département
            cursor.execute("""
                SELECT departement, COUNT(*) AS user_count
                FROM users
                GROUP BY departement
                ORDER BY user_count DESC;
            """)
            users_per_dept = [{"departement": row["departement"], "count": row["user_count"]} for row in cursor.fetchall()]

        mysql_conn.close()

        # Connexion PostgreSQL
        postgres_conn = get_postgres_connection()
        with postgres_conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cursor:
            cursor.execute("SELECT COUNT(*) AS total_books FROM recommended_books;")
            total_books = cursor.fetchone()["total_books"]

        postgres_conn.close()

        return {
            "total_users": total_users,
            "total_formations": total_formations,
            "total_courses_commences": total_courses,
            "users_per_department": users_per_dept,
            "total_books_recommandes": total_books
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/login")
async def login_user(formData: dict):
    email = formData.get("email", "").strip()
    password = formData.get("password", "").strip()

    if not email or not password:
        return {"error": "L'email et le mot de passe sont obligatoires"}

    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
            user = cursor.fetchone()
        if user:
            return {"message": "Connexion réussie", "user": user}
        else:
            return {"error": "Email ou mot de passe incorrect"}
    except Exception as e:
        return {"error": str(e)}


# ------------------- FORMATIONS -------------------
@app.get("/formations")
async def get_formations():
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM formations")
            formations = cursor.fetchall()
        return {"formations": formations}
    except Exception as e:
        return {"error": str(e)}


@app.post("/formations")
async def add_formation(data: dict):
    nom = data.get("nom")
    description = data.get("description")
    departement = data.get("departement")

    if not nom or not departement:
        return {"error": "Nom et département requis"}

    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO formations (nom, description, departement) VALUES (%s, %s, %s)",
                (nom, description, departement)
            )
        connection.commit()
        return {"message": "Formation ajoutée"}
    except Exception as e:
        return {"error": str(e)}


@app.put("/formations/{id}")
async def update_formation(id: int, data: dict):
    nom = data.get("nom")
    description = data.get("description")
    departement = data.get("departement")

    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE formations SET nom=%s, description=%s, departement=%s WHERE id=%s",
                (nom, description, departement, id)
            )
        connection.commit()
        return {"message": "Formation modifiée"}
    except Exception as e:
        return {"error": str(e)}


@app.delete("/formations/{id}")
async def delete_formation(id: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM formations WHERE id = %s", (id,))
        connection.commit()
        return {"message": "Formation supprimée"}
    except Exception as e:
        return {"error": str(e)}


# ------------------- COURS COMMENCES -------------------
@app.post("/commencer-cours")
async def commencer_cours(data: dict):
    user_id = data.get("user_id")
    formation_id = data.get("formation_id")

    if not user_id or not formation_id:
        return {"error": "user_id et formation_id sont requis"}

    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM cours_commences WHERE user_id = %s AND formation_id = %s",
                (user_id, formation_id)
            )
            existing = cursor.fetchone()
            if existing:
                return {"message": "Cours déjà commencé par cet utilisateur"}

            cursor.execute(
                "INSERT INTO cours_commences (user_id, formation_id) VALUES (%s, %s)",
                (user_id, formation_id)
            )
        connection.commit()
        return {"message": "Cours commencé avec succès"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/cours-commences/{user_id}")
async def cours_commences_par_utilisateur(user_id: int):
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT f.* FROM cours_commences cc
                JOIN formations f ON cc.formation_id = f.id
                WHERE cc.user_id = %s
            """, (user_id,))
            cours = cursor.fetchall()
        return {"cours_commences": cours}
    except Exception as e:
        return {"error": str(e)}


# ------------------- FAVORIS -------------------
SPRING_BOOT_URL = "http://localhost:8080"

@app.post("/favoris")
async def ajouter_favori(data: dict):
    try:
        response = requests.post(f"{SPRING_BOOT_URL}/api/favoris/add", json=data)
        return response.json()
    except Exception as e:
        return {"error": f"Erreur lors de l'ajout du favori : {str(e)}"}


@app.get("/favoris/{user_id}")
async def get_favoris(user_id: str):
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/api/favoris/{user_id}")
        return response.json()
    except Exception as e:
        return {"error": f"Erreur lors de la récupération des favoris : {str(e)}"}


# ------------------- RECOMMANDATIONS DE LIVRES -------------------
@app.post("/scrape-books")
async def scrape_books():
    try:
        url = "https://books.toscrape.com/catalogue/page-1.html"
        books = []
        while url:
            response = requests.get(url)
            response.encoding = 'utf-8'
            soup = BeautifulSoup(response.text, "html.parser")

            for article in soup.select("article.product_pod"):
                title = article.h3.a["title"]
                # Nettoyage de la chaîne avant conversion en float (enlever 'Â' en plus de '£')
                raw_price = article.select_one(".price_color").text
                cleaned_price = raw_price.replace("Â", "").replace("£", "").strip()
                price = float(cleaned_price)

                availability = article.select_one(".availability").text.strip()
                category = "Unknown"  # Default value

                # category is fetched from breadcrumb
                detail_link = article.h3.a["href"]
                book_url = "https://books.toscrape.com/catalogue/" + detail_link
                detail_response = requests.get(book_url)
                detail_response.encoding = 'utf-8'
                detail_soup = BeautifulSoup(detail_response.text, "html.parser")
                breadcrumb = detail_soup.select("ul.breadcrumb li a")
                if len(breadcrumb) >= 3:
                    category = breadcrumb[2].text.strip()

                books.append((title, price, category, availability))

            next_btn = soup.select_one("li.next a")
            if next_btn:
                url = "https://books.toscrape.com/catalogue/" + next_btn["href"]
            else:
                break

        conn = get_postgres_connection()
        with conn.cursor() as cursor:
            for title, price, category, availability in books:
                cursor.execute("""
                    INSERT INTO recommended_books (title, price, category, availability)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT DO NOTHING
                """, (title, price, category, availability))
            conn.commit()

        return {"message": f"{len(books)} livres insérés dans PostgreSQL"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/recommendations")
async def get_recommendations(
    category: str = Query(None),
    price_min: float = Query(None),
    price_max: float = Query(None)
):
    try:
        conn = get_postgres_connection()
        with conn.cursor() as cursor:
            query = "SELECT * FROM recommended_books WHERE 1=1"
            params = []

            if category:
                query += " AND category = %s"
                params.append(category)

            if price_min is not None:
                query += " AND price >= %s"
                params.append(price_min)

            if price_max is not None:
                query += " AND price <= %s"
                params.append(price_max)

            cursor.execute(query, tuple(params))
            rows = cursor.fetchall()

        books = []
        for row in rows:
            books.append({
                "id": row[0],
                "title": row[1],
                "price": float(row[2]),
                "category": row[3],
                "availability": row[4]
            })

        return {"books": books}
    except Exception as e:
        return {"error": str(e)}
    

import requests
from fastapi import FastAPI, Query
from pydantic import BaseModel

class BookSummaryRequest(BaseModel):
    title: str

@app.get("/books/summary")
async def get_book_summary(title: str = Query(..., description="Titre ou texte du livre à résumer")):
    try:
        ollama_url = "http://localhost:11434/api/generate"

        payload = {
            "model": "tinyllama",
            "prompt": f"Fais un résumé du livre ou texte suivant : {title}",
            "stream": False
        }

        response = requests.post(ollama_url, json=payload)
        result = response.json()

        if "response" in result:
            return {"summary": result["response"]}
        else:
            return {"error": "Aucune réponse reçue du modèle."}
    except Exception as e:
        return {"error": f"Erreur lors de la génération du résumé : {str(e)}"}



from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests



class CourseRequest(BaseModel):
    title: str

@app.post("/generate-plan/")
def generate_plan(course: CourseRequest):
    try:
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "tinyllama",
                "prompt": f"Génère un plan de cours structuré en chapitres et modules pour le sujet suivant : {course.title}",
                "stream": False
            }
        )
        ollama_response.raise_for_status()
        plan = ollama_response.json()["response"]
        return {"plan": plan}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
