def add_expense(expense, categories, count):
    try:
        amount = float(input("Enter expense amount: "))
        print("Available categories: ", ", ".join(categories))
        category = input("Enter expense category: ").capitalize()
        if category not in categories:
            print("Category not found! Please add the category first.")
        else:
            date = input("Enter expense date (YYYY-MM-DD): ")
            if count not in expense:
                expense[count] = []
            expense[count].append({"Category": category, "Amount": amount, "Date": date})
            print("Expense added successfully!")
            count = count + 1
            return count

    except ValueError:
        print("Invalid amount! Please add a numeric value.")

def view_expense(expense):
    print("Expense List")
    for count, expense_list in sorted(expense.items()):
        if count and expense_list:
            for exp in expense_list:
                print(f"{count} - {exp['Amount']} - {exp['Category']} - {exp['Date']}")
                print("")
        else:
            print("No Expense Found!")   
    

def delete_expense(expense):
    try:
        expense_number = int(input("Enter the expense number to delete: "))
        for count, expense_list in expense.items():
            if count == expense_number:
                del expense[count]
                print("Expense deleted successfully!")
                return
        print("Expense number not found!")
    except ValueError:
        print("Invalid Input! Please enter a numeric value.")

def summary_report(expense):
    total = 0
    category_total = {}
    print("Summary Report: ")
    for count, expense_list in expense.items():
        for exp in expense_list:
            total += exp['Amount']
        if exp['Category'] in category_total:
            category_total[exp['Category']] += exp['Amount']
        else:
            category_total[exp['Category']] = exp['Amount']
        print(f"Total Expenses: {total}")
        print("Category-wise Expenses:")
        for category, cat_total in category_total.items():
            print(f"{category}: {cat_total}")

def add_category(expense, categories):
    new_category = input("Enter new category name: ").capitalize()
    if new_category in categories:
        print("Category already exists!")
    else:
        categories.append(new_category)
        print(f"Category '{new_category}' added successfully!")

def show_menu():
    print("Personal Expense Management System")
    print("1. Add Expense")
    print("2. View Expenses")
    print("3. Delete Expense")
    print("4. Summary Report")
    print("5. Add Category")
    print("6. Exit")

def main():
    expense = {}
    categories = ["Food", "Rent", "Shopping", "Bills", "Transport"]
    count=1
    while True:
        show_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
           count = add_expense(expense, categories, count)
        if choice == "2":
            view_expense(expense)

        if choice == "3":
            delete_expense(expense)

        if choice == "4":
            summary_report(expense)
            
        if choice == "5":
            add_category(expense, categories)

        if choice == "6":
            print("Exiting the program. Goodbye!")
            break

        else:
            print("Exitting the Program! GoodBye.")

if __name__ == "__main__":
    main()
