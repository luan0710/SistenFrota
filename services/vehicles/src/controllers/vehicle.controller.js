const { Vehicle } = require('../models');

class VehicleController {
  async create(req, res) {
    try {
      const vehicle = await Vehicle.create(req.body);
      return res.status(201).json(vehicle);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map(e => e.message) });
      }
      return res.status(500).json({ error: 'Erro ao criar veículo' });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const offset = (page - 1) * limit;

      const vehicles = await Vehicle.findAndCountAll({
        where: filters,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return res.json({
        vehicles: vehicles.rows,
        total: vehicles.count,
        page: parseInt(page),
        totalPages: Math.ceil(vehicles.count / limit)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar veículos' });
    }
  }

  async getById(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }
      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
  }

  async update(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      await vehicle.update(req.body);
      return res.json(vehicle);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map(e => e.message) });
      }
      return res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
  }

  async delete(req, res) {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      await vehicle.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir veículo' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      await vehicle.update({ status });
      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar status do veículo' });
    }
  }

  async updateMileage(req, res) {
    try {
      const { id } = req.params;
      const { current_mileage } = req.body;

      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      if (current_mileage < vehicle.current_mileage) {
        return res.status(400).json({ error: 'Quilometragem não pode ser menor que a atual' });
      }

      await vehicle.update({ current_mileage });
      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar quilometragem do veículo' });
    }
  }
}

module.exports = new VehicleController(); 