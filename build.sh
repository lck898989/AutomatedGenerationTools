#!/bin/bash
python3 auto.py
echo ' 生成默认的default.res.json '
cd Target_Framework/
ht_res build
echo ' 执行成功！'

