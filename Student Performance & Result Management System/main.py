class StudentManager:
    def __init__(self):
        pass

    def add_student(self, students):
        student_id = input("Enter student ID: ")
        if student_id in [s["Student ID"] for s in students]:
            print("Student ID already exists!")
            return
        else:
            name = input("Enter student name: ")
            class_name = input("Enter student class: ")
            subject = input("Enter student subject: ")
            try:
                marks = float(input("Enter student marks: "))
            except ValueError:
                print("Invalid marks!")
                return

        students.append({
            "Student ID": student_id,
            "Name": name,
            "Class": class_name,
            "Subject": subject,
            "Marks": marks
        })
        print("Student added successfully!")

    def view_students(self, students):
        if not students:
            print("No students found!")
            return

        print("Student List:")
        for student in students:
            print(
                f"Student ID: {student['Student ID']}, "
                f"Name: {student['Name']}, "
                f"Class: {student['Class']}, "
                f"Subject: {student['Subject']}, "
                f"Marks: {student['Marks']}"
            )

    def delete_student(self, students):
        id_to_delete = input("Enter the ID of the student to delete: ")
        for student in students:
            if student["Student ID"] == id_to_delete:
                students.remove(student)
                print("Student deleted successfully!")
                return
        print("Student not found!")

    def update_student(self, students):
        id_to_update = input("Enter the ID of the student to update: ")
        for student in students:
            if student["Student ID"] == id_to_update:
                new_class = input("Enter new class (or press Enter to keep current): ")
                new_subject = input("Enter new subject (or press Enter to keep current): ")
                new_marks = input("Enter new marks (or press Enter to keep current): ")

                if new_class != "":
                    student["Class"] = new_class
                if new_subject != "":
                    student["Subject"] = new_subject
                if new_marks != "":
                    try:
                        student["Marks"] = float(new_marks)
                    except ValueError:
                        print("Invalid marks!")
                        return

                print("Student updated successfully!")
                return
        print("Student not found!")

    def search_student(self, students):
        search_id = input("Enter the ID of the student to search for: ")
        for student in students:
            if student["Student ID"] == search_id:
                print(
                    f"Found Student - "
                    f"ID: {student['Student ID']}, "
                    f"Name: {student['Name']}, "
                    f"Class: {student['Class']}, "
                    f"Subject: {student['Subject']}, "
                    f"Marks: {student['Marks']}"
                )
                return
        print("Student not found!")


class Student:
    def __init__(self):
        pass

    def add_marks(self, students):
        student_id = input("Enter student ID to add marks: ")
        for student in students:
            if student["Student ID"] == student_id:
                try:
                    marks = float(input("Enter marks to add: "))
                except ValueError:
                    print("Invalid marks!")
                    return
                student["Marks"] += marks
                print("Marks added successfully!")
                return
        print("Student not found!")

    def calculate_total_marks(self, students):
        total = 0
        for student in students:
            total += student["Marks"]
        print(f"Total Marks of all students: {total}")

    def calculate_percentage(self, students):
        for student in students:
            percentage = student["Marks"]
            print(
                f"Student ID: {student['Student ID']}, "
                f"Name: {student['Name']}, "
                f"Percentage: {percentage}%"
            )

    def generate_report(self, students):
        print("Student Report:")
        for student in students:
            print(
                f"Student ID: {student['Student ID']}, "
                f"Name: {student['Name']}, "
                f"Class: {student['Class']}, "
                f"Subject: {student['Subject']}, "
                f"Marks: {student['Marks']}"
            )

    def display_grades(self, students):
        print("Student Grades:")
        for student in students:
            marks = student["Marks"]
            if marks >= 90:
                grade = "A"
            elif marks >= 80:
                grade = "B"
            elif marks >= 70:
                grade = "C"
            elif marks >= 60:
                grade = "D"
            else:
                grade = "F"

            print(
                f"Student ID: {student['Student ID']}, "
                f"Name: {student['Name']}, "
                f"Grade: {grade}"
            )


class Interface:
    def __init__(self):
        self.student_manager = StudentManager()
        self.student = Student()
        self.students = []

    def show_menu(self):
        print("\nStudent Performance & Result Management System")
        print("1. Add Student")
        print("2. View Students")
        print("3. Delete Student")
        print("4. Update Student")
        print("5. Search Student")
        print("6. Add Marks")
        print("7. Calculate Total Marks")
        print("8. Calculate Percentage")
        print("9. Generate Report")
        print("10. Display Grades")
        print("11. Exit")

    def main(self):
        while True:
            self.show_menu()
            choice = input("Choose your choice: ")

            if choice == "1":
                self.student_manager.add_student(self.students)
            elif choice == "2":
                self.student_manager.view_students(self.students)
            elif choice == "3":
                self.student_manager.delete_student(self.students)
            elif choice == "4":
                self.student_manager.update_student(self.students)
            elif choice == "5":
                self.student_manager.search_student(self.students)
            elif choice == "6":
                self.student.add_marks(self.students)
            elif choice == "7":
                self.student.calculate_total_marks(self.students)
            elif choice == "8":
                self.student.calculate_percentage(self.students)
            elif choice == "9":
                self.student.generate_report(self.students)
            elif choice == "10":
                self.student.display_grades(self.students)
            elif choice == "11":
                print("Exiting the program. Goodbye!")
                break
            else:
                print("Invalid choice! Please try again.")


if __name__ == "__main__":
    interface = Interface()
    interface.main()
