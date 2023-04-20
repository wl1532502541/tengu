package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"os"
	"path"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	_ "github.com/go-sql-driver/mysql"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) TestConnect(dbType string, dsn string) string {
	db, err := sql.Open(dbType, dsn)
	if err != nil {
		return err.Error()
	}
	err = db.Ping()
	if err != nil {
		return err.Error()
	}
	err = db.Close()
	if err != nil {
		return err.Error()
	}
	return ""
}

func (a *App) SaveStorage(key string, value string) bool {
	ex, err := os.Executable()
	if err != nil {
		return false
	}
	exPath := filepath.Dir(ex)
	f, err := os.OpenFile(path.Join(exPath, key+".txt"), os.O_CREATE|os.O_WRONLY, 0644)
	defer f.Close()
	if err != nil {
		return false
	}
	_, err = f.Write([]byte(value))
	if err != nil {
		println(err.Error())
		return false
	}
	return true
}

func (a *App) GetStorage(key string) string {
	ex, err := os.Executable()
	if err != nil {
		return ""
	}
	exPath := filepath.Dir(ex)
	data, err := os.ReadFile(path.Join(exPath, key+".txt"))
	if err != nil {
		return ""
	}
	return string(data)
}

type Result struct {
	IsErr   bool
	ErrMsg  string
	Columns []string
	Rows    [][]*string
}

func (a *App) Query(dbType string, dsn string, query string) string {
	result := Result{}
	db, err := sql.Open(dbType, dsn)
	if err != nil {
		result.IsErr = true
		result.ErrMsg = err.Error()
		return toJSON(result)
	}
	defer db.Close()

	rows, err := db.Query(query)
	if err != nil {
		result.IsErr = true
		result.ErrMsg = err.Error()
		return toJSON(result)
	}

	columns, err := rows.Columns()
	if err != nil {
		result.IsErr = true
		result.ErrMsg = err.Error()
		return toJSON(result)
	}

	result.Columns = columns

	for rows.Next() {
		values := make([]*string, len(columns))
		valuePtrs := make([]interface{}, len(columns))
		for i := range columns {
			valuePtrs[i] = &values[i]
		}
		err = rows.Scan(valuePtrs...)
		if err != nil {
			result.IsErr = true
			result.ErrMsg = err.Error()
			return toJSON(result)
		}

		result.Rows = append(result.Rows, values)
	}
	var jsonBytes []byte
	jsonBytes, err = json.Marshal(result)
	if err != nil {
		return ""
	}
	return string(jsonBytes)
}

func toJSON(v interface{}) string {
	b, err := json.Marshal(v)
	if err != nil {
		return ""
	}
	return string(b)
}

func (a *App) SaveFileDialog(fileName, title, sqlContent string) (string, error) {
	ex, err := os.Executable()
	if err != nil {
		return "", err
	}
	exPath := filepath.Dir(ex)

	options := runtime.SaveDialogOptions{
		DefaultDirectory:           exPath,
		DefaultFilename:            "script.sql",
		Title:                      "save",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       true,
		TreatPackagesAsDirectories: true,
	}
	if fileName != "" {
		options.DefaultFilename = fileName
	}
	if title != "" {
		options.Title = title
	}
	savePath, err := runtime.SaveFileDialog(a.ctx, options)
	if err != nil || savePath == "" {
		return "", err
	}
	f, err := os.OpenFile(path.Join(savePath), os.O_CREATE|os.O_WRONLY, 0644)
	defer func() {
		if err := f.Close(); err != nil {
			panic(err) // 或设置到函数返回值中
		}
	}()
	if err != nil {
		return "", err
	}
	_, err = f.Write([]byte(sqlContent))
	if err != nil {
		println(err.Error())
		return "", err
	}

	return savePath, err
}
