
dev: clean
	pip install -r requirements.txt

serve: dev
	firefox localhost:8000/ &
	uvicorn main:app --reload --reload-include './client/dist'
clean:
	mkdir -p __pycache__
	rm -r __pycache__

