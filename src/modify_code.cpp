#include <iostream>
#include <fstream>
#include <regex>

int main() {
    // 設定要打開的文件路徑
    const std::string file_path = "../../javascript/localization.js";

    // 讀取文件內容
    std::ifstream file(file_path);
    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());

    // 在文件內容中查找目標字符串
    std::regex pattern("if\\(ignore_ids_for_localization\\[pnode\\.id\\] == parentType\\) return false;");
    std::smatch match;
    if (std::regex_search(content, match, pattern)) {
        // 如果找到目標字符串，則在其後插入新的代碼行
        std::string new_code = "if(pnode.classList.contains(\"ace_line\")||pnode.classList.contains(\"ace_line_group\"))return false;\n";
        std::string modified_content = content.substr(0, match.position() + match.length()) + "\n" + new_code + content.substr(match.position() + match.length());

        // 寫入修改後的內容到文件
        std::ofstream outfile(file_path);
        outfile << modified_content;
        outfile.close();

        std::cout << "代碼已成功修改並保存到文件中！" << std::endl;
    }
    else {
        std::cout << "未找到目標字符串。" << std::endl;
    }

    return 0;
}
