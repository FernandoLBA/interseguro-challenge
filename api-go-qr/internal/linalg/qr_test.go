package linalg

import (
	"math"
	"testing"
)

const testEpsilon = 1e-10

func TestQRDecompose_ReconstructOriginalMatrix(t *testing.T) {
	a := Matrix{
		{12, -51},
		{6, 167},
		{-4, 24},
	}

	q, r, err := QRDecompose(a)

	if err != nil {
		t.Fatalf("No se esperaba un error, se recibió: %v", err)
	}

	reconstructed := multiply(q, r)
	assertMatrixEqual(t, a, reconstructed, 1e-9)
}

func TestQRDecompose_QHasOrthonormalColumns(t *testing.T) {
	a := Matrix{
		{1, 1},
		{1, 0},
		{0, 1},
	}

	q, _, err := QRDecompose(a)

	if err != nil {
		t.Fatalf("No se obtuvo erros, se recibió: %v", err)
	}

	cols := len(q[0])

	for j1 := 0; j1 < cols; j1++ {
		for j2 := j1; j2 < cols; j2++ {
			dot := 0.0

			for i := 0; i < len(q); i++ {
				dot += q[i][j1] * q[i][j2]
			}

			expected := 0.0

			if j1 == j2 {
				expected = 1.0
			}

			if math.Abs(dot-expected) > testEpsilon {
				t.Errorf("Las columnas %v y %d no son ortonormales: producto punto = %f, esperado %f", j1, j2, dot, expected)
			}
		}
	}
}

func TestQRDecompose_SquareMatrix(t *testing.T) {
	a := Matrix{
		{4, 0},
		{0, 4},
	}

	q, r, err := QRDecompose(a)

	if err != nil {
		t.Fatalf("No se esperaba error: se recivio %v", err)
	}

	reconstructed := multiply(q, r)
	assertMatrixEqual(t, a, reconstructed, testEpsilon)
}

func TestQRDecompose_RejectsEmptyMatrix(t *testing.T) {
	_, _, err := QRDecompose(Matrix{})

	if err != ErrEmptyMatrix {
		t.Fatalf("Se esperaba ErrEmptyMatrix, se recibió: %v", err)
	}
}

func TestQRDecompose_RejectsNonRectangularMatrix(t *testing.T) {
	a := Matrix{
		{1, 2, 3},
		{4, 5},
	}

	_, _, err := QRDecompose(a)

	if err != ErrNotRectangular {
		t.Fatalf("Se esperaba ErrNotRectangular, se recibió: %v", err)
	}
}

func TestQRDecompose_RejectsFewerRowsThanColumns(t *testing.T) {
	a := Matrix{
		{1, 2, 3},
	}

	_, _, err := QRDecompose(a)

	if err != ErrInsufficientRows {
		t.Fatalf("Se esperaba ErrInsufficientRows, se recibió: %v", err)
	}
}

func TestQRDecompose_RejectsLinearlyDependantColumns(t *testing.T) {
	a := Matrix{
		{1, 2},
		{2, 4},
		{3, 6},
	}

	_, _, err := QRDecompose(a)

	if err != ErrLinearlyDependent {
		t.Fatalf("Se esperaba ErrLinearlyDependent, se recibió: %v", err)
	}
}

func multiply(q, r Matrix) Matrix {
	rows := len(q)
	inner := len(r)
	cols := len(q[0])

	result := newMatrix(rows, cols)

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			sum := 0.0

			for k := 0; k < inner; k++ {
				sum += q[i][k] * r[k][j]
			}

			result[i][j] = sum
		}
	}

	return result
}

func assertMatrixEqual(t *testing.T, expected, actual Matrix, epsilon float64) {
	t.Helper()

	if len(expected) != len(actual) {
		t.Fatalf("distinta cantidad de filas: esperado %v, recibido %d", len(expected), len(actual))
	}

	for i := range expected {
		if len(expected[i]) != len(actual[i]) {
			t.Fatalf("fila %d: distinta cantidad de columnas: esperado %d, recibido %d", i, len(expected[i]), len(actual[i]))
		}

		for j := range expected[i] {
			if math.Abs(expected[i][j]-actual[i][j]) > epsilon {
				t.Fatalf("posición [%d][%d]: esperado %f, recibido %f", i, j, expected[i][j], actual[i][j])
			}
		}
	}
}
