# SIT102 - File Comment Insert

This extension inserts SIT102 assignment specific comments and docstrings into C/C++ and Python files.

The extension assumes that the Splashkit project is created in a folder named after the exercise being completed. If not, any of the fields can be updated after the comment is added to the file.

## Configuration

Add your name and student ID to the SIT102 settings.

To do this, in VS Code:

* Select `File->Preferences->Settings`
* Look in the Extensions section for `SIT102`
* Update the `name` and `ID` fields

Default settings are provided, however a the values can be changes to tailor the output.

## Example File Level Comments

### C/C++

At the top of a .h, .hpp or .cpp file, the following comment will be inserted:

```cpp
/**  
 * SIT102 - Introduction to Programming  
 *  
 * Exercise:       7_1_Arrays_and_Structs  
 * Student Name:   John Doe  
 * Student ID:     22000000  
 */
```

### Python

At the top of a .py file, the following docstring will be inserted:

```python
"""SIT102 - Introduction to Programming  

 Exercise:       [8_1_Readning_Another_Language  
 Student Name:   Jane Doe  
 Student ID:     22000001  
"""
```

For further information on the format, refer to [PEP-8](https://www.python.org/dev/peps/pep-0008/) and [PEP-257](https://www.python.org/dev/peps/pep-0257/).

## Example Procedure and Function Comments

For procedures and functions, the output will be adjusted based on the signature when delcaring the procedure or function.

Some C/C++ examples include (Python will be similar, but for python multiline docstrings):

### Procedure with no Parameters

```cpp
/**  
 * Outputs `Hello World` to the standard output
 */
```

### Procedure with Parameters

```cpp
/**  
 * Outputs a string to the standard output
 *
 * @param message the message to write out
 */
```

### Function with no Parameters

```cpp
/**  
 * Returns latest weather data from the BOM API
 *
 * @returns weather data as a JSON object
 */
```

### Function with Parameters

```cpp
/**  
 * Returns the multiplication of two doubles
 *
 * @param x     x value to multiple
 * @param y     y value to multiple
 * @returns the multiplication of x and y
 */
```

## Example Enum and Struct Comments

For an enum or a struct, the following comment provides an example of the format for a C/C++ file:

```cpp
/**  
 * Defines the attiributes of an Astronaut  
 */
```

### Note

Since version 3.4, an emum type has been available for Python. As a result, the above format for enums and structs can be used with Python, however you are unlikely to need it during this subject.

<sub>In Loving Memory of Grace Stacey</sub><br/><sup>18/06/2003 - 01/01/2020</sup>