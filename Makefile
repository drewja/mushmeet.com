
dev: clean
	pip install -r requirements.txt

serve: dev
	uvicorn main:app --reload --reload-include './client/dist'	
	echo "sleep 3; firefox localhost:8000/ &" | bash
clean:
	mkdir -p __pycache__
	rm -r __pycache__
	npm --prefix client run clean
build: clean
	npm --prefix client run build

