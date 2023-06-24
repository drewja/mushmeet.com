
dev: clean
	pip install -r requirements.txt

serve: dev
	firefox localhost:5000/ &
	uvicorn main:app --reload --reload-include './client/dist' --port 5000

clean:
	mkdir -p __pycache__
	rm -r __pycache__
	mkdir -p www
	rm -r www

pub: clean
	mkdir -p www
	cp *.py www
	cp -r client/dist www
