#!/bin/bash

# Check input arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input_html_file> <output_bash_script>"
    exit 1
fi

# Input HTML file
INPUT_HTML="$1"
# Output Bash script file
OUTPUT_BASH="$2"

# Start writing the output bash script
echo "#!/bin/bash" > "$OUTPUT_BASH"
echo "" >> "$OUTPUT_BASH"
echo "# Output HTML file" >> "$OUTPUT_BASH"
echo "OUTPUT_FILE='output.html'" >> "$OUTPUT_BASH"
echo "" >> "$OUTPUT_BASH"
echo "# Start of the HTML file" >> "$OUTPUT_BASH"
echo "cat << 'EOF' > \"\$OUTPUT_FILE\"" >> "$OUTPUT_BASH"

# Read the HTML file and write each line to the bash script
while IFS= read -r line
do
    echo "$line" >> "$OUTPUT_BASH"
done < "$INPUT_HTML"

echo "EOF" >> "$OUTPUT_BASH"

# Make the generated bash script executable
chmod +x "$OUTPUT_BASH"

echo "Bash script generated at $OUTPUT_BASH"
