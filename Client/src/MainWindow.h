#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui
{
    class MainWindow;
}
QT_END_NAMESPACE

class UiMainWindow : public QMainWindow
{
    Q_OBJECT
public:
    UiMainWindow(QWidget *parent = nullptr);
    ~UiMainWindow();

private:
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H