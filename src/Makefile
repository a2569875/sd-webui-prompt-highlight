# 指定編譯器和編譯選項
CXX := g++
CXXFLAGS := -std=c++11 -Wall

# 定義目標和依賴關係
TARGET := modify_code
SRCS := modify_code.cpp

# 判斷操作系統，並選擇適當的編譯選項
ifeq ($(OS),Windows_NT)
    RM := del /Q
    TARGET_EXT := .exe
else
    RM := rm -f
    TARGET_EXT :=
endif

# 定義編譯規則
$(TARGET)$(TARGET_EXT): $(SRCS)
	$(CXX) $(CXXFLAGS) -o $@ $<

# 定義clean目標，用於刪除生成的文件
.PHONY: clean
clean:
	$(RM) $(TARGET)$(TARGET_EXT)
