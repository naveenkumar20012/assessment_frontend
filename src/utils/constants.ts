export const errorStrings: { [key: string]: string } = {
  EMAIL_NON_DELIVERABLE: "Email ID does not exist",
  EMAIL_EXISTS: "Email already exists",
  SOMETHING_WENT_WRONG: "Oops! Looks like something went wrong",
  CONTACT_SUPPORT:
    "Oops! Looks like something went wrong, please Contact Support",
};

export const baseComment = `
--------------------------------INSTRUCTIONS TO SOLVE PROGRAMMING QUESTIONS-----------------------------------
1. You must write and execute the entire program yourself.
2. The code will only be evaluated with the help of AI AFTER THE TEST IS submitted.
3. Invoke the function inside this window to test your code.
4. Output Format: For questions requiring specific output, please focus on generating the correct output 
   values rather than printing them in an exact format. The AI evaluation will consider the correctness 
   of your output, even if it is not presented in the exact format specified in the examples.

For example, if you are given the problem of writing a function to check if a number is odd or even, 
you are expected to submit your answer in the below format.

function check0ddOrEven (number) {
if (number % 2 === 0) {
  return "Even";
} else {
  return "Odd";
}

// Testing the function
checkOddOrEven (4) ; // Output: Even
check0ddOrEven (0) ; // Output: Even
-------------------------------------------------------------------------------------------------------------
`;

export const startComment = "Write your code here";

export const JavaBaseComment = `
/*
--------------------------------INSTRUCTIONS TO SOLVE PROGRAMMING QUESTIONS-----------------------------------
1. You must write and execute the entire program yourself.
2. The code will only be evaluated with the help of AI AFTER THE TEST IS submitted.
3. Do not edit the class name as we use it to evaluate your code.
4. Output Format: For questions requiring specific output, please focus on generating the correct output 
   values rather than printing them in an exact format. The AI evaluation will consider the correctness 
   of your output, even if it is not presented in the exact format specified in the examples.
-------------------------------------------------------------------------------------------------------------
*/
// Hardcode the inputs while testing instead of using scanner objects 
// as this compiler does not support inputs from the user while testing
// Add your imports here

class Main{
  // Do not edit the class name as we use it to evaluate your code
  public static void main(String []args){
    // Write your code here
    System.out.println("Hello, World!");
  }
}
`;
