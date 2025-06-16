import logging

logging.basicConfig(
    filename='simulation.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
)
logger = logging.getLogger(__name__)

def get_logger():
    return logger