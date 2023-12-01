const fs = require('fs');
const prompt = require('prompt-sync')();

class Person 
{
    constructor(name) 
    {
        this.name = name;
    }
}

class Student extends Person 
{
    constructor(rollno, name, grade, section) 
    {
        super(name);
        this.rollno = rollno;
        this.grade = grade;
        this.section = section;
    }
}

class StudentDatabase {
    constructor() {
        this.loadData();
    }

    loadData() 
    {  
        try 
        {
            const data = fs.readFileSync('students.json', 'utf8');
            this.students = JSON.parse(data);
        } 
        catch (err) 
        {
            this.students = [];
        }

    }

    saveData() {
        const data = JSON.stringify(this.students, null, 2);
        fs.writeFileSync('students.json', data, 'utf8');
    }

    viewJsonData() {
        console.log('\nJSON Data:');
        console.log(JSON.stringify(this.students, null, 2));
    }
}

class StudentFunctions extends StudentDatabase {
    addStudent(student) {
        this.students.push(student);
        this.saveData();
    }

    getStudentByRollNo(rollno) {
        return this.students.find(student => student.rollno === rollno);
    }

    editStudentData(rollno, newGrade, newSection) {
        const student = this.getStudentByRollNo(rollno);
        if (student) {
            if (newGrade !== '') {
                student.grade = newGrade;
            }
            if (newSection !== '') {
                student.section = newSection;
            }
            this.saveData();
        } else {
            console.log("Student rollno Not Found");
        }
    }

    deleteStudent(rollno) {
        this.students = this.students.filter(student => student.rollno !== rollno);
        this.saveData();
    }

    validateInput(promptMessage, validationCallback) {
        let userInput;
        let isValidInput = false;

        do {
            userInput = prompt(promptMessage);
            isValidInput = validationCallback(userInput);

            if (!isValidInput) {
                console.log('\x1b[33m%s\x1b[0m', 'Invalid input. Please try again.');
            }

        } while (!isValidInput);

        return userInput;
    }
}

const studentDB = new StudentFunctions();

while (true) {
    console.log('\x1b[32m%s\x1b[0m', "\n1. Add Student");
    console.log('\x1b[36m%s\x1b[0m', "2. Get Student Data");
    console.log('\x1b[34m%s\x1b[0m', "3. Edit Student Data");
    console.log('\x1b[31m%s\x1b[0m', "4. Delete Student Data");
    console.log('\x1b[35m%s\x1b[0m', "5. Display Students Data");
    console.log('\x1b[33m%s\x1b[0m', "6. View JSON Data");
    console.log('\x1b[33m%s\x1b[0m', "7. Exit\n");

    const option = prompt("Enter the Option: ");

    switch (option) 
    {
        case "1":
            console.log('\x1b[32m%s\x1b[0m', "\n***Adding Student***");

            let urollno = studentDB.validateInput("Enter the rollno: ", input => !isNaN(input) && input !== '' && !studentDB.getStudentByRollNo(input));
            let uname = studentDB.validateInput("Enter the name: ", input => input.trim() !== '');
            let ugrade = studentDB.validateInput("Enter the grade: ", input => input.trim() !== '');
            let usection = studentDB.validateInput("Enter the section: ", input => input.trim() !== '');

            const studentt = new Student(urollno, uname, ugrade, usection);
            studentDB.addStudent(studentt);

            console.log('\x1b[32m%s\x1b[0m', 'After adding:');
            studentDB.viewJsonData();
            break;

        case "2":
            console.log('\x1b[36m%s\x1b[0m', "\n***Getting Student Data by rollno***");

            let getrollno = studentDB.validateInput("Enter the rollno to get student's details: ", input => !isNaN(input));
            const student = studentDB.getStudentByRollNo(getrollno);

            if (student) {
                console.log("Student Details");
                console.log("Roll No\t Name\t Grade\t Section");
                console.log(`${student.rollno}\t ${student.name}\t ${student.grade}\t ${student.section}`);
            } else {
                console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
            }
            break;

        case "3":
            let rollnoToEdit = studentDB.validateInput("Enter the rollno for editing: ", input => !isNaN(input));
            const studentToEdit = studentDB.getStudentByRollNo(rollnoToEdit);

            if (studentToEdit) {
                console.log("Current Student Details");

                const newGrade = prompt("Enter the new grade: ");
                const newSection = prompt("Enter the new section: ");

                studentDB.editStudentData(rollnoToEdit, newGrade, newSection);
                console.log('Student data updated successfully:');
            } else {
                console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
            }

            console.log('After editing:');
            studentDB.viewJsonData();
            break;

        case "4":
            let rollnoToDelete = studentDB.validateInput("Enter the rollno to delete that student data: ", input => !isNaN(input));
            const studentToDelete = studentDB.getStudentByRollNo(rollnoToDelete);

            if (studentToDelete) {
                console.log("Student to Delete Details");
                console.log('\x1b[33m%s\x1b[0m', "Roll No\t Name\t Grade\t Section");
                console.log(`${studentToDelete.rollno}\t ${studentToDelete.name}\t ${studentToDelete.grade}\t ${studentToDelete.section}`);

                const confirmation = prompt("Delete student data? (yes/no): ");
                if (confirmation.toLowerCase() === "yes") {
                    studentDB.deleteStudent(rollnoToDelete);
                    console.log('Student data deleted successfully:');
                } else {
                    console.log("Deletion canceled.");
                }
            } else {
                console.log('\x1b[33m%s\x1b[0m', "Student rollno Not Found");
            }

            console.log('After deleting:');
            studentDB.viewJsonData();
            break;

        case "5":
            console.log("\nList of students");
            studentDB.viewJsonData();
            break;

        case "6":
            studentDB.viewJsonData();
            break;

        case "7":
            console.log('\x1b[33m%s\x1b[0m', "Exiting Program......");
            process.exit();

        default:
            console.log("Enter a valid option");
    }
}