#!/usr/bin/env zsh

if [ "$1" = init ]; then
touch ./timer.txt
echo "total 00:00" > ./timer.txt
fi

if [ "$1" = start ]; then
time=$(date "+%Y/%m/%d %H:%M")
# -iオプションで上書き
cat './timer.txt' | sed -i -e "1i ${time} ~" timer.txt
fi

if [ "$1" = stop ]; then
time=$(date "+%H:%M")
# 変数代入は下記で良いらしい
sed -i -r -e "s/([0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2} ~$)/\1 $time/" timer.txt
# xargs -I<変数名($なし)>で、awkの結果を変数に代入かつパイプでつなげる
# TODO: 繰り上がり
grep -E '^[0-9]{4}' ./timer.txt | sed -r 's/.*([0-9]{2}):([0-9]{2}) ~ ([0-9]{2}):([0-9]{2})$/\1 \2 \3 \4/' | awk '{print $3-$1,$4-$2}' | awk '{h += $1; m += $2;} END {print h, m}' | awk '{h = $1 + int($2 / 60); m = $2 % 60;} END {printf("%02d:%02d\n", h, m)}' | xargs -ITOTAL sed -i -r -e "s/^total.*/total TOTAL/" timer.txt 

fi