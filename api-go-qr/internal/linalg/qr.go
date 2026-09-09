package linalg

import (
	"errors"
	"math"
)

type Matrix [][]float64

var ErrEmptyMatrix = errors.New("la martiz no puede estar vacía")
var ErrNotRectangular = errors.New("todas las filas de la matriz deben tener la misma cantidad de columnas")

var ErrInsufficientRows = errors.New("la factorización QR requiere una matriz con filas >= columnas")
var ErrLinearlyDependent = errors.New("las columnas de la matriz con filas son linealmente dependientes; la factorización QR no está definida")

func Validate(a Matrix) error {
	if len(a) == 0 || len(a[0]) == 0 {
		return ErrEmptyMatrix
	}

	cols := len(a[0])

	for _, row := range a {
		if len(row) != cols {
			return ErrNotRectangular
		}
	}

	return nil
}

func QRDecompose(a Matrix) (q Matrix, r Matrix, err error) {
	if err := Validate(a); err != nil {
		return nil, nil, err
	}

	rows := len(a)
	cols := len(a[0])

	if rows < cols {
		return nil, nil, ErrInsufficientRows
	}

	v := make([]([]float64), cols)

	for j := 0; j < cols; j++ {
		v[j] = make([]float64, rows)

		for i := 0; i < rows; i++ {
			v[j][i] = a[i][j]
		}
	}

	q = newMatrix(rows, cols)
	r = newMatrix(cols, cols)

	for j := 0; j < cols; j++ {
		norm := euclideanNorm(v[j])

		if norm < epsilon {
			return nil, nil, ErrLinearlyDependent
		}

		r[j][j] = norm

		for i := 0; i < rows; i++ {
			q[i][j] = v[j][i] / norm
		}

		for k := j + 1; k < cols; k++ {
			dot := dotProductColumn(q, j, v[k])

			r[j][k] = dot

			for i := 0; i < rows; i++ {
				v[k][j] -= dot * q[i][j]
			}
		}
	}

	return q, r, nil
}

func newMatrix(rows, cols int) Matrix {
	m := make(Matrix, rows)

	for i := range m {
		m[i] = make([]float64, cols)
	}

	return m
}

func euclideanNorm(vec []float64) float64 {
	sum := 0.0

	for _, x := range vec {
		sum += x * x
	}

	return math.Sqrt(sum)
}

func dotProductColumn(q Matrix, col int, vec []float64) float64 {
	sum := 0.0

	for i := range vec {
		sum += q[i][col] * vec[i]
	}

	return sum
}
