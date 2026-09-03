import csv
import json
import os
import random

def title_case_name(raw_name):
    if not raw_name:
        return "Patient"
    parts = raw_name.strip().split()
    clean_parts = []
    for p in parts:
        # Strip honorifics like MS., MRS., DR. if desired, or keep clean
        clean = p.capitalize()
        clean_parts.append(clean)
    return " ".join(clean_parts)

def load_kaggle_dataset():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidates = [
        os.path.join(base_dir, "data", "raw", "healthcare_dataset.csv"),
        os.path.join(base_dir, "archive (2)", "healthcare_dataset.csv"),
        os.path.join(base_dir, "archive (3)", "healthcare_dataset.csv"),
    ]

    for path in candidates:
        if os.path.exists(path):
            print(f"[INFO] Found Kaggle dataset at: {path}")
            rows = []
            with open(path, mode="r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    rows.append(row)
            return rows
    
    print("[WARNING] Kaggle dataset file not found in candidates. Using fallback distributions.")
    return None

def generate_seed_data():
    raw_rows = load_kaggle_dataset()

    # 1. Services Catalog
    services = [
        {"id": "s1", "name": "MRI Scan", "department": "Radiology", "price": 18500},
        {"id": "s2", "name": "X-Ray", "department": "Radiology", "price": 2200},
        {"id": "s3", "name": "CT Scan", "department": "Radiology", "price": 12000},
        {"id": "s4", "name": "ECG Test", "department": "Cardiology", "price": 1800},
        {"id": "s5", "name": "Angiography", "department": "Cardiology", "price": 45000},
        {"id": "s6", "name": "Comprehensive Blood Test", "department": "General", "price": 1200},
        {"id": "s7", "name": "Specialist Consultation", "department": "General", "price": 800},
        {"id": "s8", "name": "Ultrasound", "department": "Radiology", "price": 3500},
        {"id": "s9", "name": "Knee Arthroscopy", "department": "Orthopedics", "price": 65000},
        {"id": "s10", "name": "EEG Scan", "department": "Neurology", "price": 8500},
    ]

    services_by_id = {s["id"]: s for s in services}

    patients = []
    admissions = []

    if raw_rows and len(raw_rows) >= 15:
        # Take 18 samples from the Kaggle dataset
        sample_rows = raw_rows[10:28]
        
        # Build patients & admissions from real Kaggle rows
        for i, row in enumerate(sample_rows):
            p_id = f"p{i+1}"
            a_id = f"a{i+1}"
            
            raw_name = row.get("Name", f"Patient {i+1}")
            clean_name = title_case_name(raw_name)
            age = int(float(row.get("Age", 45)))
            gender = "M" if row.get("Gender", "").lower() in ["male", "m", "1.0", "1"] else "F"
            
            patients.append({
                "id": p_id,
                "name": clean_name,
                "age": age,
                "gender": gender,
                "condition": row.get("Medical Condition", "General Checkup")
            })

            # Map condition to services
            cond = row.get("Medical Condition", "").lower()
            date = row.get("Date of Admission", f"2026-08-{(i%28)+1:02d}")
            if not date or len(date) < 7:
                date = f"2026-08-{(i%28)+1:02d}"

            if "cancer" in cond:
                serv_ids = ["s1", "s6", "s7"]
            elif "obesity" in cond:
                serv_ids = ["s6", "s7", "s8"]
            elif "diabetes" in cond or "hypertension" in cond:
                serv_ids = ["s4", "s6", "s7"]
            elif "asthma" in cond:
                serv_ids = ["s2", "s7"]
            elif "arthritis" in cond:
                serv_ids = ["s9", "s7"]
            else:
                serv_ids = ["s3", "s7"]

            # Explicit Leakage Anomaly Injections
            if a_id == "a7":
                serv_ids = ["s1", "s7"] # MRI Scan + Consultation
            elif a_id == "a12":
                serv_ids = ["s4", "s6", "s7"] # ECG + Blood Test + Consultation

            admissions.append({
                "id": a_id,
                "patient_id": p_id,
                "date": date,
                "service_ids": serv_ids
            })
    else:
        # Fallback synthetic generation
        patient_names = [
            ("Rajesh Sharma", 52, "M"), ("Priya Patel", 34, "F"), ("Amitabh Verma", 61, "M"),
            ("Sunita Rao", 45, "F"), ("Vikram Singh", 29, "M"), ("Ananya Das", 28, "F"),
            ("Suresh Menon", 67, "M"), ("Kavita Reddy", 50, "F"), ("Rohan Gupta", 41, "M"),
            ("Meera Joshi", 38, "F"), ("Deepak Kulkarni", 55, "M"), ("Pooja Nair", 31, "F"),
            ("Sanjay Saxena", 48, "M"), ("Neha Agarwal", 26, "F"), ("Arun Kumar", 63, "M"),
            ("Divya Bhat", 37, "F"), ("Karan Kapoor", 42, "M"), ("Shalini Pandey", 53, "F"),
        ]
        patients = [{"id": f"p{i+1}", "name": name, "age": age, "gender": gender} for i, (name, age, gender) in enumerate(patient_names)]
        admissions = [
            {"id": "a1", "patient_id": "p1", "date": "2026-03-12", "service_ids": ["s2", "s7"]},
            {"id": "a2", "patient_id": "p2", "date": "2026-03-25", "service_ids": ["s4", "s5"]},
            {"id": "a3", "patient_id": "p3", "date": "2026-04-05", "service_ids": ["s3", "s6", "s7"]},
            {"id": "a4", "patient_id": "p4", "date": "2026-04-18", "service_ids": ["s1", "s7"]},
            {"id": "a5", "patient_id": "p5", "date": "2026-05-02", "service_ids": ["s9", "s7"]},
            {"id": "a6", "patient_id": "p6", "date": "2026-05-14", "service_ids": ["s6", "s7"]},
            {"id": "a7", "patient_id": "p7", "date": "2026-06-01", "service_ids": ["s1", "s7"]},
            {"id": "a8", "patient_id": "p8", "date": "2026-06-19", "service_ids": ["s4", "s7"]},
            {"id": "a9", "patient_id": "p9", "date": "2026-07-04", "service_ids": ["s2", "s6"]},
            {"id": "a10", "patient_id": "p10", "date": "2026-07-20", "service_ids": ["s3", "s8"]},
            {"id": "a11", "patient_id": "p11", "date": "2026-08-02", "service_ids": ["s10", "s7"]},
            {"id": "a12", "patient_id": "p12", "date": "2026-08-10", "service_ids": ["s4", "s6", "s7"]},
            {"id": "a13", "patient_id": "p13", "date": "2026-08-15", "service_ids": ["s1", "s2", "s7"]},
            {"id": "a14", "patient_id": "p14", "date": "2026-08-22", "service_ids": ["s5", "s4"]},
            {"id": "a15", "patient_id": "p15", "date": "2026-08-28", "service_ids": ["s9", "s6"]},
        ]

    # Invoices & Payments
    invoices = []
    payments = []

    for i, adm in enumerate(admissions[:15]):
        inv_id = f"inv{i+1}"
        adm_service_ids = list(adm["service_ids"])
        
        # Inject leakage anomalies:
        if adm["id"] == "a7":
            # MRI Scan (s1, ₹18,500) completed, but invoice omits s1!
            billed_service_ids = ["s7"]
        elif adm["id"] == "a12":
            # ECG Test (s4, ₹1,800) completed, but omitted from invoice!
            billed_service_ids = ["s6", "s7"]
        else:
            billed_service_ids = adm_service_ids

        subtotal = sum(services_by_id[sid]["price"] for sid in billed_service_ids if sid in services_by_id)
        discount = 500 if subtotal > 20000 else (200 if subtotal > 5000 else 0)
        total = max(0, subtotal - discount)

        invoice = {
            "id": inv_id,
            "admission_id": adm["id"],
            "service_ids": billed_service_ids,
            "subtotal": subtotal,
            "discount": discount,
            "total": total
        }
        invoices.append(invoice)

        # Payments
        pay_id = f"pay{i+1}"
        if inv_id in ["inv3", "inv10"]:
            paid_amount = int(total * 0.6)
        elif inv_id in ["inv13", "inv14", "inv15"]:
            paid_amount = 0
        else:
            paid_amount = total

        if paid_amount > 0:
            payments.append({
                "id": pay_id,
                "invoice_id": inv_id,
                "amount": paid_amount,
                "date": adm["date"]
            })

    # Expenses
    expenses = [
        {"id": "e1", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 65000, "month": "2026-03"},
        {"id": "e2", "department": "Cardiology", "category": "Consumables & Lab Supplies", "amount": 42000, "month": "2026-03"},
        {"id": "e3", "department": "General", "category": "Staff Payroll & Utilities", "amount": 35000, "month": "2026-03"},
        {"id": "e4", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 68000, "month": "2026-04"},
        {"id": "e5", "department": "Cardiology", "category": "Consumables & Lab Supplies", "amount": 45000, "month": "2026-04"},
        {"id": "e6", "department": "General", "category": "Staff Payroll & Utilities", "amount": 36000, "month": "2026-04"},
        {"id": "e7", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 70000, "month": "2026-05"},
        {"id": "e8", "department": "Orthopedics", "category": "Surgical Instruments", "amount": 55000, "month": "2026-05"},
        {"id": "e9", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 72000, "month": "2026-06"},
        {"id": "e10", "department": "Cardiology", "category": "Consumables & Lab Supplies", "amount": 48000, "month": "2026-06"},
        {"id": "e11", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 75000, "month": "2026-07"},
        {"id": "e12", "department": "Orthopedics", "category": "Implants & Supplies", "amount": 60000, "month": "2026-07"},
        {"id": "e13", "department": "Radiology", "category": "Equipment Lease & Maintenance", "amount": 78000, "month": "2026-08"},
        {"id": "e14", "department": "Neurology", "category": "Diagnostic Kit Supplies", "amount": 30000, "month": "2026-08"},
        {"id": "e15", "department": "General", "category": "Staff Payroll & Utilities", "amount": 38000, "month": "2026-08"},
    ]

    seed = {
        "patients": patients,
        "services": services,
        "admissions": admissions,
        "invoices": invoices,
        "payments": payments,
        "expenses": expenses
    }

    return seed

if __name__ == "__main__":
    seed_data = generate_seed_data()
    
    out_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(out_dir, exist_ok=True)
    seed_path = os.path.join(out_dir, "seed.json")
    
    with open(seed_path, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)
    print(f"[SUCCESS] Wrote seed dataset to {seed_path}")

    public_dir = os.path.abspath(os.path.join(out_dir, "..", "frontend", "public", "data"))
    os.makedirs(public_dir, exist_ok=True)
    public_seed_path = os.path.join(public_dir, "seed.json")
    with open(public_seed_path, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)
    print(f"[SUCCESS] Wrote public seed dataset to {public_seed_path}")
