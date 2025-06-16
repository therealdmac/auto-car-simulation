from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from simulation_engine.core.logger import get_logger
from simulation_engine.core.parser import parse_text_input
from simulation_engine.core.simulator import run_all_adapters

logger = get_logger()

app = FastAPI(
    title="Auto Driving Car Simulator API",
    description="Simulates multi-car movement with collision detection and benchmarking of adapter strategies.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI()

class SimRequest(BaseModel):
    input: str

@app.post("/simulate")
async def simulate(req: SimRequest):
    field, cars = parse_text_input(req.input)
    result = run_all_adapters(field, cars)
    return result

@app.get("/")
async def root():
    return {"message": "Car Simulator API is running."}
