
dev: clean
	pip install -r requirements.txt

serve: dev
	firefox localhost:5000/ &
	uvicorn main:app --reload --reload-include './client/dist' --port 5000
clean:
	mkdir -p __pycache__
	rm -r __pycache__

