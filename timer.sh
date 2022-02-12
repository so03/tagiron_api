#!/usr/bin/env zsh

if [ "$1" = init ]; then
    touch ./timer.txt
    echo "total 00:00" >./timer.txt
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

    # timer calcと同じ
    grep -E '^[0-9]{4}' ./timer.txt | sed -r 's/.*([0-9]{2}):([0-9]{2}) ~ ([0-9]{2}):([0-9]{2}).*/\1 \2 \3 \4/' | awk '{start_min=$1*60+$2; end_min=$3*60+$4} {print start_min, end_min}' | awk '{diff+=$2-$1} END {print diff}' | awk '{hour=int($1/60);min=$1%60;printf("%02d:%02d\n",hour,min)}' | xargs -ITOTAL sed -i -r -e 's/^total.*/total TOTAL/' ./timer.txt
fi

if [ "$1" = calc ]; then
    # xargs -I<変数名($なし)>で、awkの結果を変数に代入かつパイプでつなげる
    grep -E '^[0-9]{4}' ./timer.txt | sed -r 's/.*([0-9]{2}):([0-9]{2}) ~ ([0-9]{2}):([0-9]{2}).*/\1 \2 \3 \4/' | awk '{start_min=$1*60+$2; end_min=$3*60+$4} {print start_min, end_min}' | awk '{diff+=$2-$1} END {print diff}' | awk '{hour=int($1/60);min=$1%60;printf("%02d:%02d\n",hour,min)}' | xargs -ITOTAL sed -i -r -e 's/^total.*/total TOTAL/' ./timer.txt
fi
