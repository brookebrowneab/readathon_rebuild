<?php

namespace App\Repository;

use App\Support\Database;

class TeacherRepository
{
    public function findByUsername(string $username): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT id_table, teacherUserName, grade, defaultVal, homeroom FROM teachers WHERE teacherUserName = :username');
        $stmt->execute(['username' => $username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function listHomeroomTeachers(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id_table, teacherUserName, grade, defaultVal, homeroom FROM teachers WHERE homeroom = 1 ORDER BY teacherUserName'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function listAll(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT id_table, teacherUserName, grade, defaultVal, homeroom FROM teachers');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT id_table, teacherUserName, grade, defaultVal, homeroom FROM teachers WHERE id_table = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO teachers (teacherUserName, grade, defaultVal, homeroom) VALUES (:name, :grade, :email, :homeroom)'
        );
        $stmt->execute([
            'name' => $data['name'],
            'grade' => $data['grade'],
            'email' => $data['email'],
            'homeroom' => $data['homeroom'],
        ]);

        $id = (int) $pdo->lastInsertId();
        return $this->findById($id) ?? [];
    }

    public function update(int $id, array $fields): ?array
    {
        if (empty($fields)) {
            return $this->findById($id);
        }

        $pdo = Database::connection();
        $columns = [];
        $params = ['id' => $id];
        foreach ($fields as $key => $value) {
            $columns[] = "{$key} = :{$key}";
            $params[$key] = $value;
        }
        $sql = 'UPDATE teachers SET ' . implode(', ', $columns) . ' WHERE id_table = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM teachers WHERE id_table = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
