import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {SimpleTableColumn, SimpleTableData,} from '@delon/abc';
import {Router} from "@angular/router";
import {_HttpClient} from "@delon/theme";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ListService} from "./list.service";

@Component({
    selector: 'app-user-list',
    templateUrl: './list.component.html',
})
export class UserListComponent implements OnInit {
    public isSpinning = false;
    public total = 0;
    public pageSizeOptions = [3, 5, 10];
    public searchForm: FormGroup;
    public params = {};
    users: any[] = [];
    q: any = {
        pi: 1,
        ps: 5,
        sorter: '',
        status: null,
        statusList: [],
    };


    constructor(
        private router: Router,
        private http: _HttpClient,
        private msg:  NzMessageService,
        private fb: FormBuilder,
        public index: ListService) {
        this.searchFormInit();
    }

    ngOnInit(): void {
        this.getData();
    }

    searchFormInit() {
        this.searchForm = this.fb.group({
            username: '',
            realname: '',
            mobile: '',
            // start_time: null,
            // end_time: null,
            status: '',
        });

    }

    submit(value: any) {
        console.log(this.searchForm.value);
    }


    change(value: any) {
        console.log('change', value);
    }


    status = [
        { index: 1, text: '正常', value: false, type: 'default', checked: false },
        { index: 2, text: '锁定', value: false, type: 'success', checked: false },
    ];

    columns: SimpleTableColumn[] = [
        { title: '', index: 'id', type: 'checkbox' },
        { title: '编号', index: 'id'},
        { title: '用户昵称', index: 'username'},
        { title: '真实姓名', index: 'realname'},
        { title: '手机号', index: 'mobile'},
        { title: '创建时间',  index: 'created_at'},
        { title: '头像', index: 'image_path', type: 'img'},
        {
            title: '状态',
            type: 'badge',
            index: 'status',
            filters: this.status,
            filter: () => true,
            badge: {
                1: { text: '正常', color: 'success' },
                2: { text: '锁定', color: 'warning' },
            },
        },
        {
            title: '操作',
            buttons: [
                {
                    text: `编辑`,
                    type: 'none',
                    click: ((record: any) => this.router.navigate(['/user/edit/' + record.id])),
                }
            ],
        },
    ];
    public static checkboxChange(ret: any) {
        console.log('checkboxChange', ret);
    }
    public static sortChange(ret: any) {
        console.log('sortChange', ret);
    }


    getData() {
        this.isSpinning = true;
        console.log(this.searchForm.value);
        const url = 'http://www.admin-api.com/adminList';
        this.http.get(url, this.searchForm.value).subscribe((res: any) => {
            //console.log(res);
            this.isSpinning = false;
            this.users = res.data.data;
            this.total = res.data.total;
        });
    }

    dataChange(data: SimpleTableData[]) {
        return data.map((i: SimpleTableData, index: number) => {
            i.disabled = index === 0;
            i.hidden = index === 1;
            return i;
        });
    }



    onReset() {
        this.searchFormInit();
        this.getData();
    }


}