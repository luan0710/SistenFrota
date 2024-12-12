const { Maintenance } = require('../models');
const axios = require('axios');

class MaintenanceController {
  async create(req, res) {
    try {
      // Verifica se o veículo existe
      try {
        await axios.get(`${process.env.VEHICLES_SERVICE_URL}/api/vehicles/${req.body.vehicle_id}`, {
          headers: { Authorization: req.headers.authorization }
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return res.status(404).json({ error: 'Veículo não encontrado' });
        }
        return res.status(500).json({ error: 'Erro ao verificar veículo' });
      }

      const maintenance = await Maintenance.create(req.body);
      return res.status(201).json(maintenance);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map(e => e.message) });
      }
      return res.status(500).json({ error: 'Erro ao criar manutenção' });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10, vehicle_id, status, type } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (vehicle_id) where.vehicle_id = vehicle_id;
      if (status) where.status = status;
      if (type) where.type = type;

      const maintenances = await Maintenance.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['scheduled_date', 'DESC']]
      });

      return res.json({
        maintenances: maintenances.rows,
        total: maintenances.count,
        page: parseInt(page),
        totalPages: Math.ceil(maintenances.count / limit)
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar manutenções' });
    }
  }

  async getById(req, res) {
    try {
      const maintenance = await Maintenance.findByPk(req.params.id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }
      return res.json(maintenance);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar manutenção' });
    }
  }

  async update(req, res) {
    try {
      const maintenance = await Maintenance.findByPk(req.params.id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }

      // Se estiver alterando o veículo, verifica se o novo veículo existe
      if (req.body.vehicle_id && req.body.vehicle_id !== maintenance.vehicle_id) {
        try {
          await axios.get(`${process.env.VEHICLES_SERVICE_URL}/api/vehicles/${req.body.vehicle_id}`, {
            headers: { Authorization: req.headers.authorization }
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
          }
          return res.status(500).json({ error: 'Erro ao verificar veículo' });
        }
      }

      await maintenance.update(req.body);
      return res.json(maintenance);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.errors.map(e => e.message) });
      }
      return res.status(500).json({ error: 'Erro ao atualizar manutenção' });
    }
  }

  async delete(req, res) {
    try {
      const maintenance = await Maintenance.findByPk(req.params.id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }

      await maintenance.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir manutenção' });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const maintenance = await Maintenance.findByPk(id);
      if (!maintenance) {
        return res.status(404).json({ error: 'Manutenção não encontrada' });
      }

      // Se estiver completando a manutenção, atualiza a data de conclusão
      if (status === 'completed' && maintenance.status !== 'completed') {
        maintenance.completed_date = new Date();
      }

      await maintenance.update({ status });

      // Se completou a manutenção, atualiza o status do veículo
      if (status === 'completed') {
        try {
          await axios.patch(
            `${process.env.VEHICLES_SERVICE_URL}/api/vehicles/${maintenance.vehicle_id}/status`,
            { status: 'active' },
            { headers: { Authorization: req.headers.authorization } }
          );
        } catch (error) {
          console.error('Erro ao atualizar status do veículo:', error);
        }
      }

      return res.json(maintenance);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar status da manutenção' });
    }
  }

  async getByVehicle(req, res) {
    try {
      const { vehicle_id } = req.params;
      const maintenances = await Maintenance.findAll({
        where: { vehicle_id },
        order: [['scheduled_date', 'DESC']]
      });

      return res.json(maintenances);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar manutenções do veículo' });
    }
  }
}

module.exports = new MaintenanceController(); 