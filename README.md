# Command Line Utility Documentation

---

## FILESYSTEM

### `up`

Moves the current working directory one level up.

- You cannot move above the current `root_directory`.

---

### `cd path_to_directory`

Changes the current working directory to the specified directory.

- `path_to_directory` – path to the target directory.
- If the path is a file or is outside the `root_directory`, an appropriate message will be displayed.

---

### `ls`

Print in console list of all files and folders in current directory.

- list contains files and folder names (for files - with extension)
- folders and files are sorted in alphabetical order ascending, but list of folders goes first
- type of directory content displays in a separate column

---

### `cat path_to_file`

Displays the contents of the specified file.

- `path_to_file` – path to the file whose contents should be displayed.
- If the path is not a file or is outside the `root_directory`, an appropriate message will be displayed.

---

### `add new_file_name`

Creates an empty file with the given name in the current working directory.

- `new_file_name` – name for the new file. If a full path is provided instead of filename, only filename will be considered.
- If a file with the same name already exists, an appropriate message will be shown.

---

### `mkdir new_directory_name`

Creates a directory with the specified name.

- `new_directory_name` – the name of the folder. If a path is provided, everything except the final directory name will be discarded.
- If a folder with that name already exists, an appropriate message will be shown.

---

### `rn path_to_file new_filename`

Renames a file.

- `path_to_file` – the path to the file to rename (can be relative or absolute).
- If the path is invalid, points to a directory(not a file), or is outside the `root_directory`, an appropriate message will be shown.
- `new_filename` – new name for the file. If a path is provided, only the final segment (the filename) is used.
- If a file with the new name already exists in the same directory, an appropriate message will be shown.

---

### `cp path_to_file path_to_new_directory`

Copies the file to the specified directory.

- `path_to_file` – path to the source file.
- If the path is invalid, not a file, outside the `root_directory`, or a file with the same name already exists in the target folder, an appropriate message will be shown.
- `path_to_new_directory` – path to the target directory.
- If the path is invalid, not a folder, or outside the `root_directory`, an appropriate message will be shown.

---

### `mv path_to_file path_to_new_directory`

Moves a file to the specified directory (similar to copy, but deletes the original file).

- File transfer is done using readable and writable streams.
- Same rules and validations as with the `cp` command apply.

---

### `rm path_to_file`

Deletes the specified file.

- `path_to_file` – path to the file to be deleted.
- If the path is invalid, not a file, or outside the `root_directory`, an appropriate message will be shown.

---

## OPERATING SYSTEM INFO

### `os --EOL`

Prints the default system End-Of-Line character.

### `os --cpus`

Displays information about the host machine’s CPUs: total count, model, and clock rate (GHz) for each.

### `os --homedir`

Prints the user's home directory.

### `os --username`

Prints the current system username (not the app-start username).

### `os --architecture`

Prints the CPU architecture for which the Node.js binary was compiled.

---

## HASH

### `hash path_to_file`

Displays the SHA-256 hash of the specified file.

- `path_to_file` – path to the file to hash.
- If the file doesn’t exist, is not a file, or the path is outside `root_directory`, an appropriate message will be shown.

---

## COMPRESS / DECOMPRESS

### `compress path_to_file path_to_destination`

Compresses a file using the Brotli algorithm.

- The resulting file will have the same name with a `.br` extension.
- If the file doesn’t exist, is not a file, or is outside `root_directory`, or if the destination folder already contains a file with the same name, an appropriate message will be shown.

### `decompress path_to_file path_to_destination`

Decompresses a Brotli-compressed file.

- The output file will have the original name without the `.br` extension.
- If the file doesn’t exist, is not a file, or is outside `root_directory`, or if a file with the same name already exists in the destination folder, an appropriate message will be shown.
