
LIBNAME:=torusvis
LIBVER:=0.0.1
CONCAT:=utils/concat.py
GENTAGS:=utils/gen-tags.js

BLD_DIR:=build
SRC_DIR:=.

LIB_SRC_DIR:=$(SRC_DIR)/src
LIB_BLD_DIR:=$(BLD_DIR)/lib
LIB_SRC:=$(wildcard $(LIB_SRC_DIR)/*.js)

LIB_BASENAME:=$(LIB_BLD_DIR)/$(LIBNAME)-$(LIBVER)
LIB:=$(LIB_BASENAME).js
MINLIB:=$(LIB_BASENAME).min.js

TST_SRC_DIR:=$(SRC_DIR)/test
TST_BLD_DIR:=$(BLD_DIR)/test
TST_SRC:=$(wildcard $(TST_SRC_DIR)/*-test.js)

TST:=$(TST_SRC:$(TST_SRC_DIR)/%=$(TST_BLD_DIR)/%)




all: paper.pdf

paper.pdf: paper.tex paper.aux paper.bbl
	pdflatex paper.tex
	pdflatex paper.tex

paper.bbl: paper.tex paper.aux
	bibtex paper.aux

paper.aux: paper.tex
	pdflatex paper.tex

clean:
	rm -rf paper.aux paper.bbl paper.pdf paper.blg paper.log

.PHONY: all clean

