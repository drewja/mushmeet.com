#!/bin/sh

uvicorn main:app --reload --reload-include client/dist

