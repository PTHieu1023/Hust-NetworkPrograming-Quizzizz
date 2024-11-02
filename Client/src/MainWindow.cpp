//
// Created by Hiusnef on 02/11/2024.
//

#include "MainWindow.h"
#include "resources/ui/ui_mainwindow.h"

UiMainWindow::UiMainWindow(QWidget *parent)
    : QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

UiMainWindow::~UiMainWindow()
{
    delete ui;
}
